import mongoose from 'mongoose';

const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
    validate(agencia) {
      if (agencia % 1 !== 0 || agencia < 0)
        throw new Error('Porfavor digite numeros inteiros, positivos.');
    },
  },
  conta: {
    type: Number,
    required: true,
    validate(conta) {
      if (conta % 1 !== 0 || conta < 0)
        throw new Error('Porfavor digite numeros inteiros, positivos.');
    },
  },
  name: {
    type: String,
  },
  balance: {
    type: Number,
    validate(balance) {
      if (balance < 0)
        throw Error('A conta não pode ser criada com balanço negativo');
    },
  },
});

const accountModel = mongoose.model('accounts', accountSchema);

export { accountModel };
