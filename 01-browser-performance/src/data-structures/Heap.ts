export type HeapComparator<T> = (a: T, b: T) => number;

export class Heap<T> {
  private items: T[] = [];

  constructor(
    private limit: number,
    private readonly compare: HeapComparator<T>,
  ) {}

  get size(): number {
    return this.items.length;
  }

  get isEmpty(): boolean {
    return this.size === 0;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  push(value: T): void {
    this.items.push(value);
    this.siftUp(this.size - 1);
  }

  pop(): T | undefined {
    if (this.items.length === 0) {
      return undefined;
    }

    if (this.items.length === 1) {
      return this.items.pop();
    }

    const root = this.items[0];
    const last = this.items.pop()!;

    this.items[0] = last;
    this.siftDown(0);

    return root;
  }

  replaceTop(value: T): T | undefined {
    if (this.items.length === 0) {
      this.items.push(value);
      return undefined;
    }

    const root = this.items[0];

    this.items[0] = value;
    this.siftDown(0);

    return root;
  }

  insert(value: T): void {
    if (this.size < this.limit) {
      this.push(value);
      return;
    }

    const worstItem = this.peek()!;

    if (this.compare(value, worstItem) < 0) {
      this.replaceTop(value);
    }
  }

  toArray(): T[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }

  private siftUp(index: number): void {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex);

      if (
        this.compare(this.items[currentIndex], this.items[parentIndex]) <= 0
      ) {
        break;
      }

      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }

  private siftDown(index: number): void {
    let currentIndex = index;

    while (true) {
      const leftIndex = this.getLeftChildIndex(currentIndex);
      const rightIndex = this.getRightChildIndex(currentIndex);

      let highestPriorityIndex = currentIndex;

      if (
        leftIndex < this.items.length &&
        this.compare(this.items[leftIndex], this.items[highestPriorityIndex]) >
          0
      ) {
        highestPriorityIndex = leftIndex;
      }

      if (
        rightIndex < this.items.length &&
        this.compare(this.items[rightIndex], this.items[highestPriorityIndex]) >
          0
      ) {
        highestPriorityIndex = rightIndex;
      }

      if (highestPriorityIndex === currentIndex) {
        break;
      }

      this.swap(currentIndex, highestPriorityIndex);
      currentIndex = highestPriorityIndex;
    }
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return index * 2 + 1;
  }

  private getRightChildIndex(index: number): number {
    return index * 2 + 2;
  }

  private swap(firstIndex: number, secondIndex: number): void {
    [this.items[firstIndex], this.items[secondIndex]] = [
      this.items[secondIndex],
      this.items[firstIndex],
    ];
  }
}
