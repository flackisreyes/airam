import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Almacenamiento clave-valor mínimo.
 * - En producción: Upstash Redis (variables KV_REST_API_URL/KV_REST_API_TOKEN que crea Vercel,
 *   o UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN).
 * - En local sin esas variables: un archivo JSON en .data/db.json para poder probar.
 */
export interface Store {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  /** Guarda solo si la clave no existe. Devuelve true si se guardó. */
  setNX(key: string, value: unknown): Promise<boolean>;
  del(key: string): Promise<void>;
  hget<T>(key: string, field: string): Promise<T | null>;
  hset(key: string, field: string, value: unknown): Promise<void>;
  hdel(key: string, field: string): Promise<void>;
  hgetall<T>(key: string): Promise<Record<string, T>>;
}

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const isPersistentStore = Boolean(url && token);

function redisStore(): Store {
  const r = new Redis({ url: url!, token: token! });
  return {
    get: (k) => r.get(k),
    set: async (k, v) => void (await r.set(k, v)),
    setNX: async (k, v) => (await r.set(k, v, { nx: true })) === "OK",
    del: async (k) => void (await r.del(k)),
    hget: (k, f) => r.hget(k, f),
    hset: async (k, f, v) => void (await r.hset(k, { [f]: v })),
    hdel: async (k, f) => void (await r.hdel(k, f)),
    hgetall: async <T,>(k: string) => ((await r.hgetall<Record<string, T>>(k)) ?? {}) as Record<string, T>,
  };
}

function fileStore(): Store {
  const file = path.join(process.cwd(), ".data", "db.json");
  type DB = Record<string, unknown>;
  let queue = Promise.resolve();

  const read = async (): Promise<DB> => {
    try {
      return JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      return {};
    }
  };
  const write = async (db: DB) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(db, null, 2));
  };
  // Serializa las escrituras para evitar condiciones de carrera en local.
  const mutate = <R,>(fn: (db: DB) => R): Promise<R> => {
    const run = queue.then(async () => {
      const db = await read();
      const res = fn(db);
      await write(db);
      return res;
    });
    queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  };
  const hash = (db: DB, k: string) => (db[k] ??= {}) as Record<string, unknown>;

  return {
    get: async <T,>(k: string) => ((await read())[k] as T) ?? null,
    set: (k, v) => mutate((db) => void (db[k] = v)),
    setNX: (k, v) =>
      mutate((db) => {
        if (k in db) return false;
        db[k] = v;
        return true;
      }),
    del: (k) => mutate((db) => void delete db[k]),
    hget: async <T,>(k: string, f: string) =>
      (((await read())[k] as Record<string, T> | undefined)?.[f] as T) ?? null,
    hset: (k, f, v) => mutate((db) => void (hash(db, k)[f] = v)),
    hdel: (k, f) => mutate((db) => void delete hash(db, k)[f]),
    hgetall: async <T,>(k: string) => ((await read())[k] as Record<string, T>) ?? {},
  };
}

export const store: Store = isPersistentStore ? redisStore() : fileStore();
