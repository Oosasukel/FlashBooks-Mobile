# Versões usadas

- jdk 17.0.12
- Node v22.12.0

# ENV

Ao rodar o projeto ou fazer algum build, se foi alterado alguma env, rode o comando `expo:clean` (caso de querer rodar o projeto) ou `android:clean` (caso de querer fazer um build) para limpar o cache do expo.

# Release

> **Antes de publicar em produção:** o fluxo de pagamento migrado para o
> react-native-iap 14 (Play Billing 8) ainda não foi testado com uma compra real.
> Validar na trilha de teste interno com conta de testador de licença primeiro.
> Detalhes em `CLAUDE.md`.


Para fazer um build. Editar versionCode e versionName no arquivo `android\app\build.gradle`. Executar o `android:clean` para limpar algum cache de env. Executar `android:build:staging` para criar o aab. Ele será gerado em `android\app\build\outputs\bundle\release\app-release.aab`.
