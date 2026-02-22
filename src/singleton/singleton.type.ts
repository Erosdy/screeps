export type SingletonClass<T> = {
    getInstance(): T;
}