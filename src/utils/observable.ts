export interface Observer<T> {
  /**
   * Unique identifier of the observer.
   */
  getId(): string;

  /**
   * Callback function which is invoked once new data arrives.
   */
  onData(data: T): void
}

export class Observable<T> {
  private id: string;
  protected observers: Array<Observer<T>>;

  constructor(id: string) {
    this.id = id;
    this.observers = [];
  }
  public getId() {
    return this.id;
  }

  public addObserver(obs: Observer<T>) {
    this.observers.push(obs);
  }

  public removeObserver(obs: Observer<T>) {
    this.observers = this.observers.filter(o => o.getId() !== obs.getId());
  }

  public notifyObservers(data: T) {
    for (let obs of this.observers) {
      try {
        obs.onData(data);
      } catch (error) {
        console.log(`Exception occured when notifying ${obs.getId()} about new data ${data}, reason: ${error}`)
      }
    }
  }
}
