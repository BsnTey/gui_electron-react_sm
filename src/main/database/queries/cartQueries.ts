import { Proxy } from '../models/proxy.entity';
import { AccountSportmaster } from '../models/accounts.entity';
import { CartIn } from '../models/createCart/in.entity';
import { CartOut } from '../models/createCart/out.entity';
import { sequelize } from '../connect';

export const getProxy = async () => {
  try {
    const proxies = await Proxy.findAll();
    return proxies;
  } catch (error) {
    console.error('Error while retrieving proxies:', error);
    throw error;
  }
};

export const getRandomProxy = async () => {
  try {
    const proxy = await Proxy.findOne({ order: sequelize.random() });
    return proxy;
  } catch (error) {
    console.error('Error while retrieving random proxy:', error);
    throw error;
  }
};

export const getCartOutputAccounts = async () => {
  try {
    const accounts = await CartOut.findAll();
    return accounts;
  } catch (error) {
    console.error('Error while retrieving accounts:', error);
    throw error;
  }
};

export const getCartInputAccounts = async () => {
  try {
    const accounts = await CartIn.findAll();
    return accounts;
  } catch (error) {
    console.error('Error while retrieving accounts:', error);
    throw error;
  }
};

export const addCartInputAccounts = async (deviceId: string) => {
  try {
    await CartIn.create({
      deviceId,
    });
  } catch (error) {
    console.error('Error while retrieving account:', error);
    throw error;
  }
};

export const addCartOutputAccounts = async (deviceId: string) => {
  try {
    await CartOut.create({
      deviceId,
    });
  } catch (error) {
    console.error('Error while retrieving account:', error);
    throw error;
  }
};

export const getAccountForWork = async () => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const account = await CartIn.findOne({
      transaction,
      lock: transaction.LOCK.UPDATE,
    }); // Берём первую запись и блокируем её для других транзакций

    if (!account) throw new Error('No account available');

    await account.destroy({ transaction }); // Удаляем запись в рамках той же транзакции

    await transaction.commit(); // Подтверждаем транзакцию

    return account.deviceId; // Возвращаем данные из ячейки deviceId
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error while retrieving account:', error);
    throw error;
  }
};

export const getDataAccount = async (deviceId: string) => {
  try {
    const account = await AccountSportmaster.findOne({
      where: { deviceId },
      attributes: ['cookie'],
    });
    if (!account) {
      throw new Error(`Account with deviceId ${deviceId} not found`);
    }

    return account.cookie;
  } catch (error) {
    console.error('Error while retrieving account:', error);
    throw error;
  }
};

// export const setProxy = async (proxyData) => {
//   try {
//     const createdProxy = await Proxy.create(proxyData);
//     return createdProxy;
//   } catch (error) {
//     console.error('Error while creating proxy:', error);
//     throw error;
//   }
// };

export const updateAllProxies = async (updatedData: string) => {
  const newProxies = updatedData
    .split('\n')
    .filter((proxy) => proxy.trim().length > 0);

  try {
    await Proxy.destroy({
      truncate: true, // this will delete all rows from the table
    });

    for (const proxy of newProxies) {
      await Proxy.create({ proxy: proxy.trim() });
    }
  } catch (error) {
    console.error('Error while updating proxies:', error);
    throw error;
  }
};

export const updateInputAccounts = async (updatedData: string) => {
  const splitAccounts = updatedData
    .split('\n')
    .filter((account) => account.trim().length > 0);

  try {
    await CartIn.destroy({
      truncate: true, // this will delete all rows from the table
    });

    for (const deviceId of splitAccounts) {
      await CartIn.create({ deviceId: deviceId.trim() });
    }

    return true;
  } catch (error) {
    console.error('Error while updating accounts:', error);
    throw error;
  }
};
