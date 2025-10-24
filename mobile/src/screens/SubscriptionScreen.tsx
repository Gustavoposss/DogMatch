import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Cores inline para evitar problemas de importação
const Colors = {
  primary: '#ee7c2b',
  backgroundLight: '#f8f7f6',
  textLightPrimary: '#1b130d',
  textLightSecondary: '#9a6c4c',
  white: '#FFFFFF',
  surfaceLight: '#ffffff',
  border: '#E1E5E9',
  success: '#4CAF50',
  error: '#F44336',
};
import { Ionicons } from '@expo/vector-icons';

interface Subscription {
  id: string;
  name: string;
  price: string;
  period: string;
  status: 'active' | 'inactive';
  renewalDate: string;
  image?: string;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
}

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    loadSubscription();
    loadPlans();
  }, []);

  const loadSubscription = async () => {
    try {
      // Simular carregamento da assinatura atual
      const mockSubscription: Subscription = {
        id: 'premium',
        name: 'Plano Cão-panheiro Premium',
        price: 'R$ 29,90',
        period: '/ mês',
        status: 'active',
        renewalDate: '15 de Julho, 2024',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi28YpTMC5ObczNxr7H6b0wxH0C7Om253VlYaOLVTZEQYD5gSqz5awviR1O4NDxa6o-95XuuWXMCToaxPL33O0YSxMV8qrZktU6UQejXYA_10PttD-ICS0LVtDthusYR-Dj6oN9_W5pGcJrzw_2TsKv6LYoTk87BJSw69DbE-6FznAddKg1JCndFljrk9b87rae2tmOwHbFQo1WpcBCO5d1ybnrka_QOw3rVgAzGTosdoUy5HxIELGsJhpKHI8SDCAh-CVrp8tCzjA'
      };
      setSubscription(mockSubscription);
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
    }
  };

  const loadPlans = async () => {
    try {
      const mockPlans: Plan[] = [
        {
          id: 'monthly',
          name: 'Plano Mensal',
          price: 'R$ 29,90',
          period: '/mês',
          features: [
            'Likes ilimitados',
            '5 Super Likes por semana',
            'Veja quem te curtiu'
          ],
          current: true
        },
        {
          id: 'yearly',
          name: 'Plano Anual',
          price: 'R$ 299,90',
          period: '/ano',
          features: [
            'Todos os benefícios do plano mensal',
            'Economize 2 meses',
            'Impulso de perfil semanal'
          ],
          popular: true
        }
      ];
      setPlans(mockPlans);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    }
  };

  const handlePlanUpgrade = (planId: string) => {
    if (planId === 'yearly') {
      navigation.navigate('PaymentPix' as never);
    }
  };

  const handleCancelSubscription = () => {
    // Implementar cancelamento
    console.log('Cancelar assinatura');
  };

  const renderCurrentSubscription = () => (
    <View style={styles.subscriptionCard}>
      {subscription?.image && (
        <Image
          source={{ uri: subscription.image }}
          style={styles.subscriptionImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.subscriptionInfo}>
        <Text style={styles.statusText}>Status: Ativa</Text>
        <Text style={styles.subscriptionName}>{subscription?.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.subscriptionPrice}>{subscription?.price}</Text>
          <Text style={styles.subscriptionPeriod}>{subscription?.period}</Text>
        </View>
        <Text style={styles.renewalText}>
          Sua assinatura será renovada em {subscription?.renewalDate}.
        </Text>
      </View>
    </View>
  );

  const renderPlanCard = (plan: Plan) => (
    <View key={plan.id} style={[
      styles.planCard,
      plan.popular && styles.popularPlanCard
    ]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Mais Popular</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          <Text style={styles.planPeriod}>{plan.period}</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.planButton,
          plan.current && styles.currentPlanButton,
          plan.popular && styles.upgradeButton
        ]}
        onPress={() => handlePlanUpgrade(plan.id)}
        disabled={plan.current}
      >
        <Text style={[
          styles.planButtonText,
          plan.current && styles.currentPlanButtonText,
          plan.popular && styles.upgradeButtonText
        ]}>
          {plan.current ? 'Seu Plano Atual' : 'Fazer Upgrade'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textLightPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Assinatura</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Subscription */}
        {subscription && renderCurrentSubscription()}

        {/* Section Header */}
        <Text style={styles.sectionTitle}>Explore outros planos</Text>

        {/* Plans Grid */}
        <View style={styles.plansGrid}>
          {plans.map(renderPlanCard)}
        </View>

        {/* Action Links */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
          >
            <Text style={styles.cancelText}>Cancelar Assinatura</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Links */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Termos de Serviço</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Política de Cancelamento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.textLightPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subscriptionCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  subscriptionImage: {
    width: '100%',
    height: 200,
  },
  subscriptionInfo: {
    padding: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
    marginBottom: 8,
  },
  subscriptionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  subscriptionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
  },
  subscriptionPeriod: {
    fontSize: 16,
    color: Colors.textLightSecondary,
    marginLeft: 4,
  },
  renewalText: {
    fontSize: 14,
    color: Colors.textLightSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    marginTop: 16,
    marginBottom: 12,
  },
  plansGrid: {
    gap: 16,
    marginVertical: 12,
  },
  planCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  popularPlanCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -14,
    left: '50%',
    marginLeft: -60,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.textLightPrimary,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textLightSecondary,
    marginLeft: 12,
  },
  planButton: {
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  currentPlanButton: {
    backgroundColor: 'rgba(238, 124, 43, 0.1)',
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentPlanButtonText: {
    color: Colors.primary,
  },
  upgradeButtonText: {
    color: Colors.white,
  },
  actionContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  cancelButton: {
    paddingVertical: 16,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F44336',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 16,
  },
  footerLink: {
    paddingVertical: 8,
  },
  footerLinkText: {
    fontSize: 12,
    color: Colors.textLightSecondary,
    textDecorationLine: 'underline',
  },
});