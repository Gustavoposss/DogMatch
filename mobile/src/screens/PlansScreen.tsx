import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
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

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
}

export default function PlansScreen() {
  const navigation = useNavigation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      // Simular carregamento de planos
      const mockPlans: Plan[] = [
        {
          id: 'free',
          name: 'FREE',
          price: 'R$ 0',
          period: '',
          features: [
            'Criação de perfil',
            'Swipes limitados por dia',
            'Mensagens com matches'
          ]
        },
        {
          id: 'basic',
          name: 'BASIC',
          price: 'R$ 19,90',
          period: '/mês',
          features: [
            'Swipes ilimitados',
            'Ver quem curtiu seu pet'
          ]
        },
        {
          id: 'premium',
          name: 'PREMIUM',
          price: 'R$ 29,90',
          period: '/mês',
          features: [
            '5 Super Likes mensais',
            'Destacar o perfil do pet',
            'Filtros de busca avançados'
          ],
          popular: true
        }
      ];
      setPlans(mockPlans);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    }
  };

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      navigation.goBack();
    } else {
      // Navegar para pagamento
      navigation.navigate('PaymentPix' as never);
    }
  };

  const renderPlanCard = (plan: Plan) => (
    <View key={plan.id} style={[
      styles.planCard,
      plan.popular && styles.popularCard
    ]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Mais Popular</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={[styles.planName, plan.popular && styles.popularPlanName]}>
          {plan.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.period}>{plan.period}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.selectButton,
          plan.popular && styles.popularButton,
          plan.id === 'free' && styles.freeButton
        ]}
        onPress={() => handlePlanSelect(plan.id)}
      >
        <Text style={[
          styles.buttonText,
          plan.popular && styles.popularButtonText,
          plan.id === 'free' && styles.freeButtonText
        ]}>
          {plan.id === 'free' ? 'Continuar Grátis' : 
           plan.id === 'basic' ? 'Escolher o Basic' : 'Seja Premium'}
        </Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        {plan.id !== 'free' && (
          <Text style={styles.featuresTitle}>
            {plan.id === 'basic' ? 'Tudo do plano FREE, e mais:' : 'Tudo do plano BASIC, e mais:'}
          </Text>
        )}
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={Colors.textLightPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Desbloqueie mais recursos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Billing Cycle Toggle */}
        <View style={styles.billingContainer}>
          <View style={styles.billingToggle}>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingCycle === 'monthly' && styles.billingOptionActive
              ]}
              onPress={() => setBillingCycle('monthly')}
            >
              <Text style={[
                styles.billingText,
                billingCycle === 'monthly' && styles.billingTextActive
              ]}>
                Mensal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingCycle === 'yearly' && styles.billingOptionActive
              ]}
              onPress={() => setBillingCycle('yearly')}
            >
              <Text style={[
                styles.billingText,
                billingCycle === 'yearly' && styles.billingTextActive
              ]}>
                Anual
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.savingsText}>
            Economize até 25% no plano anual!
          </Text>
        </View>

        {/* Plans Grid */}
        <View style={styles.plansGrid}>
          {plans.map(renderPlanCard)}
        </View>

        {/* Footer Links */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restaurar Compras</Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            A assinatura será renovada automaticamente. Você pode cancelar a qualquer momento. 
            Para mais informações, consulte nossos{' '}
            <Text style={styles.linkText}>Termos de Serviço</Text>.
          </Text>
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
  closeButton: {
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
    marginRight: 40, // Compensar o botão de fechar
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  billingContainer: {
    marginVertical: 12,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 24,
    padding: 4,
    marginBottom: 8,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  billingOptionActive: {
    backgroundColor: Colors.surfaceLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  billingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textLightSecondary,
  },
  billingTextActive: {
    color: Colors.textLightPrimary,
  },
  savingsText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
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
  popularCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
  },
  popularText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    marginTop: 16,
    marginBottom: 20,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    marginBottom: 8,
  },
  popularPlanName: {
    color: Colors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.textLightPrimary,
  },
  period: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLightSecondary,
    marginLeft: 4,
  },
  selectButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  popularButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  freeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
  },
  popularButtonText: {
    color: Colors.white,
  },
  freeButtonText: {
    color: Colors.textLightPrimary,
  },
  featuresContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 12,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textLightPrimary,
    marginLeft: 12,
  },
  footer: {
    marginTop: 16,
    paddingVertical: 16,
  },
  restoreButton: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  restoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLightSecondary,
    textDecorationLine: 'underline',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textLightSecondary,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
  linkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});