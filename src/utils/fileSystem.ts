import RNFS from 'react-native-fs';

export const APP_DIRS = {
  TEAM: `${RNFS.DocumentDirectoryPath}/Team`,
  TESTIMONIALS: `${RNFS.DocumentDirectoryPath}/Testimonials`,
  SERVICES: `${RNFS.DocumentDirectoryPath}/Services`,
};

export const ensureDirsExist = async () => {
  for (const dir of Object.values(APP_DIRS)) {
    if (!(await RNFS.exists(dir))) {
      await RNFS.mkdir(dir);
    }
  }
};

export const saveContentItem = async (tempUri: string, category: keyof typeof APP_DIRS, fileName: string) => {
  await ensureDirsExist();
  const destPath = `${APP_DIRS[category]}/${fileName}`;
  if (await RNFS.exists(destPath)) {
    await RNFS.unlink(destPath); // Overwrite if exists
  }
  await RNFS.copyFile(tempUri, destPath);
  return destPath;
};

export const getDirectoryItems = async (category: keyof typeof APP_DIRS) => {
  await ensureDirsExist();
  const items = await RNFS.readDir(APP_DIRS[category]);
  return items.filter(item => item.isFile());
};

export const deleteContentItem = async (path: string) => {
  if (await RNFS.exists(path)) {
    await RNFS.unlink(path);
  }
};

// Helper function to save images permanently (Legacy/General use)
export const saveImageToAppDirectory = async (tempUri: string): Promise<string> => {
    const fileName = tempUri.split('/').pop();
    const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    try {
        await RNFS.copyFile(tempUri, newPath);
        return newPath;
    } catch (error) {
        console.error('Error saving image: ', error);
        throw error;
    }
};
