import { useSubscription } from 'hooks/useSubscription';
import React, { useEffect } from 'react';
import { finishTransaction, purchaseUpdatedListener, useIAP } from 'react-native-iap';
import { subscriptionsService } from 'services/subscriptions';
import { Toast } from 'toastify-react-native';

interface IAPListenerProviderProps {
  children: React.ReactNode;
}

export const IAPListenerProvider: React.FC<IAPListenerProviderProps> = ({
  children,
}) => {
  const { connected } = useIAP();
  const { setSubscription } = useSubscription();

  useEffect(() => {
    if (!connected) return;

    // A limpeza de compras pendentes "fantasma" deixou de ser manual: a partir da
    // v14 a lib configura PendingPurchasesParams no BillingClient por conta própria.
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        // O JSON original do Play vinha em `transactionReceipt` na v12; na v14 o
        // mesmo conteúdo (Purchase.originalJson) fica em `dataAndroid`.
        // Purchase tambem nao e um union discriminado por `platform`, entao a
        // checagem e pela presenca do campo Android.
        const receipt =
          'dataAndroid' in purchase ? purchase.dataAndroid : null;

        if (!receipt) return;

        try {
          const { subscription } = await subscriptionsService.verifyPurchase(
            JSON.parse(receipt)
          );

          setSubscription(subscription);

          await finishTransaction({ purchase, isConsumable: false });

          console.log('Transação finalizada com sucesso!');
        } catch (err) {
          Toast.show({
            type: 'error',
            text1: `Ocorreu um erro ao processar a assinatura. ${
              err instanceof Error ? err.message : 'Erro desconhecido'
            }`,
            visibilityTime: 7000,
          });
        }
      }
    );

    return () => {
      purchaseUpdateSubscription.remove();
    };
  }, [connected, setSubscription]);

  return <>{children}</>;
};
