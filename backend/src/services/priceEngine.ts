import { EventEmitter } from 'events';

export interface PriceSnapshot {
  BTC: number;
  ETH: number;
  VRD: number;
  updatedAt: string;
}

const INITIAL_PRICES: Omit<PriceSnapshot, 'updatedAt'> = {
  BTC: 67240.5,
  ETH: 3480.2,
  VRD: 1.25,
};

const UPDATE_INTERVAL_MS = 12_000;
const MIN_VARIANCE = 0.002;
const MAX_VARIANCE = 0.003;

class PriceEngine extends EventEmitter {
  private prices: PriceSnapshot = { ...INITIAL_PRICES, updatedAt: new Date().toISOString() };
  private timer: NodeJS.Timeout | null = null;

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), UPDATE_INTERVAL_MS);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private tick() {
    const next: PriceSnapshot = {
      BTC: this.walk(this.prices.BTC),
      ETH: this.walk(this.prices.ETH),
      VRD: this.walk(this.prices.VRD),
      updatedAt: new Date().toISOString(),
    };
    this.prices = next;
    this.emit('update', next);
  }

  private walk(price: number) {
    const magnitude = MIN_VARIANCE + Math.random() * (MAX_VARIANCE - MIN_VARIANCE);
    const direction = Math.random() > 0.5 ? 1 : -1;
    const next = price * (1 + direction * magnitude);
    return Math.round(next * 100) / 100;
  }

  getSnapshot(): PriceSnapshot {
    return this.prices;
  }
}

export const priceEngine = new PriceEngine();
