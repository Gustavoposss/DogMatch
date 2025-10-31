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
import { Colors } from '../styles/colors';
import { subscriptionService } from '../services/subscriptionService';
import { paymentService } from '../services/paymentService';
import { Ionicons } from '@expo/vector-icons';

interface Plan {
  id: string; // manter para key
  type: 'FREE' | 'PREMIUM' | 'VIP';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const api = await subscriptionService.getPlans();
      const mapped: Plan[] = (api?.plans || []).map((p: any) => ({
        id: p.type,
        type: p.type,
        name: (p.name || '').toUpperCase(),
        price: `R$ ${Number(p.price || 0).toFixed(2)}`,
        period: '/mês',
        features: p.features || [],
        popular: p.type === 'PREMIUM',
      }));
      setPlans(mapped);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      setPlans([
        { id: 'FREE', type: 'FREE', name: 'FREE', price: 'R$ 0,00', period: '', features: ['Swipes limitados', 'Ver matches'] },
        { id: 'PREMIUM', type: 'PREMIUM', name: 'PREMIUM', price: 'R$ 19,90', period: '/mês', features: ['Swipes ilimitados', 'Ver quem curtiu', '1 Boost/mês'], popular: true },
        { id: 'VIP', type: 'VIP', name: 'VIP', price: 'R$ 39,90', period: '/mês', features: ['Tudo do Premium', '3 Boosts/mês', 'Desfazer Swipe'] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (planId: string) => {
    try {
      if (planId === 'FREE') {
        (navigation as any).goBack();
        return;
      }
      const planType = planId as 'PREMIUM' | 'VIP';
      const payment = await paymentService.createPayment(planType, 'PIX');
      const pix = payment?.pixQrCode || {};
      const qrCodeImage = pix?.encodedImage
        ? `data:image/png;base64,${pix.encodedImage}`
        : '';
      const pixCode = pix?.payload || '';
      (navigation as any).navigate('PaymentPix', {
        paymentId: payment?.paymentId,
        pixCode,
        qrCodeImage,
        amount: payment?.value ?? payment?.amount ?? (planType === 'PREMIUM' ? 19.9 : 39.9),
        planName: planType,
      });
    } catch (error: any) {
      console.error('Erro ao iniciar pagamento:', error);
      alert(error?.response?.data?.error || 'Não foi possível iniciar o pagamento.');
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
          plan.id === 'FREE' && styles.freeButton
        ]}
        onPress={() => handlePlanSelect(plan.id)}
      >
        <Text style={[
          styles.buttonText,
          plan.popular && styles.popularButtonText,
          plan.id === 'FREE' && styles.freeButtonText
        ]}>
          {plan.id === 'FREE' ? 'Continuar Grátis' : 
           plan.id === 'PREMIUM' ? 'Escolher o Premium' : 'Seja VIP'}
        </Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        {plan.id !== 'FREE' && (
          <Text style={styles.featuresTitle}>
            {plan.id === 'PREMIUM' ? 'Tudo do plano FREE, e mais:' : 'Tudo do plano PREMIUM, e mais:'}
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Desbloqueie mais recursos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            Para mais informações, consulte nossos <Text style={styles.linkText}>Termos de Serviço</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
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
    color: Colors.textPrimary,
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
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  billingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  billingTextActive: {
    color: Colors.textPrimary,
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
    backgroundColor: Colors.surface,
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
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
  },
  period: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textSecondary,
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
    color: Colors.textPrimary,
  },
  popularButtonText: {
    color: Colors.white,
  },
  freeButtonText: {
    color: Colors.textPrimary,
  },
  featuresContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 12,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
  linkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});