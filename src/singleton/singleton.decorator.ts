type Constructor<T = any> = new (...args: any[]) => T;

export function Singleton<T extends Constructor>(target: T) {
    let instance: InstanceType<T> | null = null;

    return class SingletonWrapper extends target {
        constructor(...args: any[]) {
            super(...args);
            throw new Error(`Impossible d'instancier ${target.name} directement: c'est un singleton`);
        }

        static getInstance(): InstanceType<T> {
            if (instance == null) {
                instance = new target() as InstanceType<T>;
            }
            return instance as InstanceType<T>;
        }
    };
}