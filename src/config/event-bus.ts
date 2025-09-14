import { EventEmitter } from "events";

// 앱 전체에서 단일 객체 유지
class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() { super(); }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }
}

export const eventBus = EventBus.getInstance();