export default {
  expo: {
    name: "Par de Patas",
    slug: "par-de-patas",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      // Variáveis de ambiente
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
      environment: process.env.EXPO_PUBLIC_ENVIRONMENT || "development",
      localIp: process.env.EXPO_PUBLIC_LOCAL_IP || "192.168.0.10",
    }
  }
};
