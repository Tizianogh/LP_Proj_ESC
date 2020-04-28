clear
figlet "STEVIANO"
echo -e "\e[1m[SERVEUR] : Création de la backup..."
tar -cf backup_versions/backup$(date +'%d%m%Y%H%M').tar LP_Proj_ESC/
echo -e "[SERVEUR] : Supression du dossier local LP_Proj_ESC..."
rm -rf LP_Proj_ESC/
echo -e "\e[5m[SERVEUR] : Clonage depuis le repository distant..."
echo -e "\e[0m"
git clone --single-branch --branch develop https://github.com/nicolasKACEM/LP_Proj_ESC.git
rm -rf LP_Proj_ESC/ESC2020/ESC2020/Program.cs
rm -rf LP_Proj_ESC/ESC2020/ESC2020/appsettings.json
rm -rf LP_Proj_ESC/ESC2020/ESC2020/ClientApp/angular.json
echo -e "\e[1m[SERVEUR] : Ecriture des fichiers de configuration serveur..."
echo -e "\e[0m"
cp conf_files/Program.cs LP_Proj_ESC/ESC2020/ESC2020/
cp conf_files/appsettings.json LP_Proj_ESC/ESC2020/ESC2020/
cp conf_files/angular.json LP_Proj_ESC/ESC2020/ESC2020/ClientApp/
cd LP_Proj_ESC/ESC2020/ESC2020/ClientApp/
echo -e "\e[1m[SERVEUR] : Correction de l'installation de angularxqr-code..."
echo -e "\e[0m"
npm uninstall angularx-qrcode --save
npm install angularx-qrcode@2.1.0 --save
echo -e "\e[1m[SERVEUR] : Correction de l'installation de tslib..."
npm install --save tslib
cp -r node_modules/tslib ../../node_modules/
cp -r node_modules/tslib ../../node_modules/@microsoft/signalr/dist/esm/
cd ../..
echo -e "\e[1m[SERVEUR] : Compilation.."
echo -e "\e[0m"
dotnet publish -c Release
cd ../..
rm -rf LP_Proj_ESC/ESC2020/ESC2020/bin/Debug
sudo systemctl restart kestrel-ESC2020.service
echo -e "\e[42m[SERVEUR] : Serveur démarré ! :-)"
echo -e "\e[49m"
echo -e "\e[0m"
