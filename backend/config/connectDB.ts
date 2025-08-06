import mongoose from 'mongoose';

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not defined');
    process.exit(1);
}

let cachedConnection: typeof mongoose | null = null;
let isConnecting = false;

const connectDB = async (mongoUri: string) => {
    // Если уже подключены, возвращаем кешированное подключение
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using cached database connection.');
        return cachedConnection;
    }

    // Если уже идет процесс подключения, ждем его завершения
    if (isConnecting) {
        console.log('Connection in progress, waiting...');
        // Ждем пока подключение не установится или не упадет
        while (isConnecting && mongoose.connection.readyState === 2) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (mongoose.connection.readyState === 1) {
            return cachedConnection;
        }
    }

    // Если есть неактивное подключение, закрываем его
    if (cachedConnection && mongoose.connection.readyState !== 1) {
        try {
            await mongoose.disconnect();
        } catch (err) {
            console.log('Error disconnecting:', err);
        }
        cachedConnection = null;
    }

    isConnecting = true;

    try {
        console.log('Establishing new database connection...');

        const options = {
            // Увеличиваем таймауты для serverless окружения
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000,

            // Настройки для replica set
            retryWrites: true,
            w: 'majority' as const,

            // Настройки пула для serverless
            maxPoolSize: 5,
            minPoolSize: 0, // Изменено на 0 для serverless
            maxIdleTimeMS: 30000,

            // ВАЖНО: Включаем буферизацию для предотвращения ошибок
            // bufferMaxEntries: 0,
            bufferCommands: true, // Включаем обратно для стабильности

            // IPv4 для стабильности
            family: 4,

            // Дополнительные настройки
            heartbeatFrequencyMS: 2000,
            // serverSelectionRetryDelayMS: 2000,
        };

        const connection = await mongoose.connect(mongoUri, options);

        // Ждем полного установления подключения
        await new Promise<void>((resolve, reject) => {
            if (mongoose.connection.readyState === 1) {
                resolve();
            } else {
                const timeout = setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 15000);

                mongoose.connection.once('connected', () => {
                    clearTimeout(timeout);
                    resolve();
                });

                mongoose.connection.once('error', (err) => {
                    clearTimeout(timeout);
                    reject(err);
                });
            }
        });

        cachedConnection = connection;
        console.log('✅ Database connected successfully');

        return connection;
    } catch (error: any) {
        cachedConnection = null;
        console.error('❌ Database connection failed:', error.message);
        throw error;
    } finally {
        isConnecting = false;
    }
};

// Обработчики событий соединения
mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err);
    cachedConnection = null;
    isConnecting = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected');
    cachedConnection = null;
    isConnecting = false;
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 Mongoose reconnected');
});

// Функция проверки подключения
export const isConnected = (): boolean => {
    return mongoose.connection.readyState === 1;
};

// Функция для получения статуса
export const getConnectionStatus = (): string => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[mongoose.connection.readyState] || 'unknown';
};

// Функция для принудительного ожидания подключения
export const waitForConnection = async (timeout = 10000): Promise<void> => {
    if (isConnected()) return;

    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Connection timeout'));
        }, timeout);

        const checkConnection = () => {
            if (isConnected()) {
                clearTimeout(timeoutId);
                resolve();
            } else {
                setTimeout(checkConnection, 100);
            }
        };

        checkConnection();
    });
};

export default connectDB;
