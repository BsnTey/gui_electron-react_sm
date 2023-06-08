import { Proxy } from '../models/proxy.entity';
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

export const getCartAccounts = async () => {
  try {
    const accounts = await CartOut.findAll();
    return accounts;
  } catch (error) {
    console.error('Error while retrieving proxies:', error);
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
