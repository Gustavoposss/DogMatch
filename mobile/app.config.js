export default {
  expo: {
    name: "Par de Patas",
    slug: "par-de-patas",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    android: {
      package: "com.pardepatas.app",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      navigationBar: {
        backgroundColor: "#ffffff",
        barStyle: "light-content"
      }
    },
    ios: {
      bundleIdentifier: "com.pardepatas.app",
      buildNumber: "1.0.0",
      supportsTablet: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      // Variáveis de ambiente
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://dogmatch.onrender.com",
      environment: process.env.EXPO_PUBLIC_ENVIRONMENT || "production",
      localIp: process.env.EXPO_PUBLIC_LOCAL_IP || "192.168.101.5",
      debug: process.env.EXPO_PUBLIC_DEBUG || "false",
      // EAS Project ID
      eas: {
        projectId: "46e25515-55ac-4769-961b-746250332341"
      }
    }
  }
};
