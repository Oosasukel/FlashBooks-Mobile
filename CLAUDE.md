# FlashBooks Mobile

App React Native com Expo SDK 53 em bare workflow: a pasta `android/` é versionada
e editada à mão. Não regerar com `expo prebuild` — isso apagaria as customizações
do `android/app/build.gradle` (leitura de `.env` via dotenv-java, signing configs).

## ⚠️ Pendente: validar o fluxo de pagamento (aberto em 22/08/2026)

O `react-native-iap` foi migrado da v12 para a v14 (commit `77feef4`) para atender ao
requisito de Google Play Billing 8.0.0. **A compra de assinatura ainda não foi testada
com uma compra real.**

Já validado: `tsc`, `eslint`, build de release completo, e o app sobe no Android 16
sem crash com o módulo nativo do Nitro carregando.

Não validado: `requestPurchase` → `purchaseUpdatedListener` →
`subscriptionsService.verifyPurchase()` → webhook.

Ponto de atenção: o recibo enviado ao backend mudou de `purchase.transactionReceipt`
para `purchase.dataAndroid`. O conteúdo é o mesmo (`Purchase.originalJson` do Play),
então o backend não deveria precisar de mudança — mas é exatamente isso que o teste
precisa confirmar.

Como testar: subir o `versionCode`, gerar o AAB de produção, publicar na trilha de
teste interno e comprar com uma conta da lista de testadores de licença do Play
Console (não gera cobrança real, mas dispara webhook e verificação de verdade).

**Não publicar em produção antes disso.** Apagar esta seção quando o teste passar.

## Requisitos do Google Play 2026

Ambos já atendidos no código, mas as notificações do Play Console só somem quando um
release compatível for publicado:

- **targetSdk 36 (Android 16)** — definido por `android.targetSdkVersion` em
  `android/gradle.properties`, que sobrescreve o version catalog do Expo. Foi a
  alternativa a subir Expo SDK 53 → 54.
- **Play Billing 8.0.0** — via react-native-iap 14.

Não há urgência de publicar: o app segue disponível na loja e instalável por usuários
novos. O prazo de 31/08/2026 tranca apenas a *publicação de atualizações*.

A verificação de desenvolvedor Android (prazo 30/09/2026) já está concluída — o pacote
`com.softminer.flashbooks` está registrado e a chave do `release-key.jks` verificada.

## Windows

O caminho deste projeto estoura o `MAX_PATH` (260) ao compilar o C++ do Nitro, usado
pelo react-native-iap 14+. O `android/build.gradle` encurta o staging dir do CMake
para `C:/.cxx/<módulo>`. Se o projeto for movido para um caminho curto, ou se
`LongPathsEnabled` for ativado no Windows, esse bloco pode sair.
