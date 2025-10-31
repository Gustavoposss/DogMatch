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
import { Colors } from '../styles/colors';
import { subscriptionService } from '../services/subscriptionService';
import { paymentService } from '../services/paymentService';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscription();
    loadPlans();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const sub = await subscriptionService.getMySubscription();
      if (sub) {
        setSubscription({
          id: sub.id,
          name: sub.planName || sub.name,
          price: sub.priceFormatted || (sub.amount ? `R$ ${Number(sub.amount).toFixed(2)}` : ''),
          period: sub.periodLabel || (sub.period === 'MONTHLY' ? '/ mês' : sub.period === 'YEARLY' ? '/ ano' : ''),
          status: sub.status === 'ACTIVE' ? 'active' : 'inactive',
          renewalDate: sub.renewalDateFormatted || sub.renewalDate || '',
          image: sub.image || undefined,
        });
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const apiPlans = await subscriptionService.getPlans();
      const mapped: Plan[] = (apiPlans?.plans || apiPlans || []).map((p: any) => ({
        id: p.type || p.id,
        name: (p.name || p.title || '').toUpperCase(),
        price: p.priceFormatted || (p.price ? `R$ ${Number(p.price).toFixed(2)}` : 'R$ 0'),
        period: '/mês',
        features: p.features || [],
        popular: !!p.popular,
        current: subscription ? (p.type || p.id) === subscription.id : false,
      }));
      setPlans(mapped);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      setPlans([]);
    }
  };

  const handlePlanUpgrade = async (planId: string) => {
    try {
      const payment = await paymentService.createPayment(planId as any, 'PIX');
      const pix = payment?.pixQrCode || {};
      const qrCodeImage = pix?.encodedImage
        ? `data:image/png;base64,${pix.encodedImage}`
        : '';
      const pixCode = pix?.payload || '';
      (navigation as any).navigate('PaymentPix', {
        paymentId: payment?.paymentId,
        pixCode,
        qrCodeImage,
        amount: payment?.value ?? payment?.amount,
        planName: planId,
      });
    } catch (error) {
      console.error('Erro ao iniciar upgrade:', error);
      alert('Não foi possível iniciar o upgrade.');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await subscriptionService.cancelSubscription();
      await loadSubscription();
      alert('Assinatura cancelada com sucesso.');
    } catch (error) {
      alert('Não foi possível cancelar a assinatura.');
    }
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
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
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
  },
  subscriptionPeriod: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  renewalText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
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
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});