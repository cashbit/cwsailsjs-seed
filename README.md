## SAILSJS SEED

You can quicly setup a new SAILSJS application with user management and authentication with this SEED.

### Setup

Copy the whole directory in a new directory with the name of your new app, place: ```mynewapp```.



1. installazione di MongoDB
2. configurazione della sicurezza per MongoDB
3. installazione di SiadMiGo

### Installazione di MongoDB

A questo [link] (http://docs.mongodb.org/manual/installation/) sono disponibili le istruzioni di installazione di MongoDB per i diversi sistemi operativi.

### Configurazione della sicurezza su MongoDB

#### Attivazione utente amministrazione

Entrare nella console di mongodb e digitare le seguenti righe di comando:

```
use admin
db.addUser({user: "admin", pwd: "mysecret", roles: [ "userAdminAnyDatabase" ]})
```
Uscire dalla console di mongodb per rientrare subito dopo con l'utente admin con la seguente riga di comando:

```
mongo admin
```

appena entrati, lanciare i seguenti comandi che creano il db ```mynewapp``` e l'utenza utilizzata dall' app per autenticarsi:

```
use mynewapp
db.addUser({user: "mynewapp", pwd: "mysecret", roles: [ "readWrite", "dbAdmin" ]})
```

successivamente costruire il db di gestione delle sessioni e relativa utenza per l'app:

```
use sails
db.addUser({user: "sails", pwd: "mysecret", roles: ["readWrite", "dbAdmin"]}) 
```

Occorre adesso configurare il file ```mongod.conf``` in modo da attivare l'obbligatorietà di autenticazione.
Aggiungere o impostare se già esistenti le seguenti configurazioni:

```
auth=true
bind_ip=127.0.0.1; per limitare l’accesso a localhost
```

Riavviare il mongod, da questo momento per entrare sarà necessario utilizzare la seguente riga di comando

```
mongo mynewapp -u mynewapp -p mysecret 
```

### Adapters configuration

Configurare i file: ```config/adapter.js``` e ```config/session.js``` indicando utenti e password come da precedenti configurazioni.


### App.js configuration

Editare ```config/app.js``` per definire impostazioni quali: titolo applicazione, valori di default.

E' possibile specificare, per ogni gruppo di utenti, nome applicazione, pagina home di default, menu di navigazione, motore di ricerca.

Si vedano i commenti nel file per ulteriori dettagli.
