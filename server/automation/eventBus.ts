type Handler = (payload: any) => Promise<void> | void;
const listeners = new Map<string, Handler[]>();

export function on(event: string, handler: Handler) {
  const arr = listeners.get(event) ?? [];
  arr.push(handler); 
  listeners.set(event, arr);
}

export async function emit(event: string, payload: any) {
  const arr = listeners.get(event) ?? [];
  for (const h of arr) {
    try {
      await Promise.resolve(h(payload));
    } catch (error) {
      console.error(`Error in event handler for ${event}:`, error);
    }
  }
}