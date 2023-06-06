import { Proxy } from '../models/proxy.entity';

export const getProxy = async () => {
  try {
    const proxies = await Proxy.findAll();
    return proxies;
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
