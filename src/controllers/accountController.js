import { accountModel } from '../models/accountModel.js';
import * as helpers from '../helpers/helpers.js';
const getAll = async (_, res) => {
  try {
    const accounts = await accountModel.find({});
    res.send(accounts);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getBalance = async (req, res) => {
  try {
    const { agencia, conta } = req.params;
    const account = await accountModel.findOne({ agencia, conta });
    if (!account) {
      res.status(400).send('Documento não encontrado na coleção');
    }
    const { balance } = account;
    res.send({ balance });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAgenciaBalance = async (req, res) => {
  try {
    const { agencia } = req.params;
    const [balance] = await accountModel
      .aggregate()
      .match({ agencia: +agencia })
      .group({ _id: null, media: { $avg: '$balance' } });

    if (!balance) {
      res.status(400).send('Documento não encontrado na coleção');
    }

    res.send(balance);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getMenorSaldo = async (req, res) => {
  try {
    const { qtd } = req.params;
    const menorSaldo = await accountModel
      .find({}, { _id: 0, agencia: 1, conta: 1, balance: 1 })
      .sort({ balance: 1 })
      .limit(+qtd);

    if (!menorSaldo) {
      res.status(400).send('Documento não encontrado na coleção');
    }

    res.send(menorSaldo);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getMaiorSaldo = async (req, res) => {
  try {
    const { qtd } = req.params;
    const maiorSaldo = await accountModel
      .find({}, { _id: 0, agencia: 1, conta: 1, balance: 1, name: 1 })
      .sort({ balance: -1 })
      .limit(+qtd)
      .sort({ name: 1 });

    if (!maiorSaldo) {
      res.status(400).send('Documento não encontrado na coleção');
    }

    res.send(maiorSaldo);
  } catch (err) {
    res.status(500).send(err);
  }
};

const privade99 = async (req, res) => {
  try {
    const agencias = await accountModel
      .find({})
      .sort({ balance: -1 })
      .distinct('agencia');

    if (!agencias) {
      res.status(400).send('Você não tem nenhuma agencia cadastrada');
    }

    for (let i = 0; i < agencias.length; i++) {
      const [account] = await accountModel
        .find({ agencia: agencias[i] })
        .sort({ balance: -1 })
        .limit(1);

      if (account.agencia !== 99) {
        await accountModel.updateOne(account, { agencia: 99 });
      }
    }

    const privade99List = await accountModel
      .find({ agencia: 99 })
      .sort({ balance: -1 });

    if (!privade99List) {
      res.status(400).send('Não há nenhuma conta private99');
    }

    res.send(privade99List);
  } catch (err) {
    res.status(500).send(err);
  }
};

const insert = async (req, res) => {
  try {
    const account = new accountModel(req.body);
    await account.save();
    res.send(account);
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    let { agencia, conta, value } = req.body;
    const account = await accountModel.findOne({ agencia, conta });
    if (value < 0) --value;

    if (!helpers.isNumber(value)) {
      res.status(500).send('Parametro "value" não é um numero.');
      throw Error('Parametro "value" não é um numero.');
    }

    if (!account) {
      res.status(400).send('Documento não encontrado na coleção');
    }

    if (account.balance + value < 0) {
      res.status(500).send('Você não tem saldo suficiente');
      throw Error('Você não tem saldo suficiente');
    }
    const newBalance = account.balance + value;
    const accountUpdate = await accountModel.findOneAndUpdate(
      { agencia, conta },
      {
        balance: newBalance,
      },
      { new: true }
    );
    res.send(accountUpdate);
  } catch (err) {
    res.status(501).send(err);
  }
};

const transfer = async (req, res) => {
  try {
    let { conta_origem, conta_distino, value } = req.body;
    let valueTaxa = value;
    const accounts = await accountModel.find({
      $or: [{ conta: conta_origem }, { conta: conta_distino }],
    });
    let [origem, destino] = accounts;

    if (accounts.length !== 2)
      res.status(400).send('Document2 não encontrado na coleção');
    if (origem.agencia !== destino.agencia) valueTaxa = value + 8;

    if (origem.balance - valueTaxa < 0) {
      res.status(500).send('Você não tem saldo suficiente');
      throw Error('Você não tem saldo suficiente');
    }
    const { balance } = await accountModel.findOneAndUpdate(
      { conta: origem.conta },
      { balance: origem.balance - valueTaxa },
      { new: true }
    );
    await accountModel.findOneAndUpdate(
      { conta: destino.conta },
      { balance: destino.balance + value }
    );

    res.send({ balance });
  } catch (err) {
    res.status(501).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const account = await accountModel.findOneAndDelete({
      _id: req.params.id,
    });
    console.log(account);
    if (!account) res.status(400).send('Documento não encontrado na coleção');
    res.send(account);
  } catch (err) {}
};

const removeCount = async (req, res) => {
  try {
    const { agencia, conta } = req.params;
    const account = await accountModel.findOneAndDelete({ agencia, conta });
    if (!account) {
      res.status(400).send('Documento não encontrado na coleção');
    }
    const countAgencia = await accountModel.countDocuments({ agencia });
    res.send({ countAgencia });
  } catch (err) {
    res.status(500).send(err);
  }
};

export default {
  getAll,
  getBalance,
  insert,
  update,
  transfer,
  remove,
  removeCount,
  getAgenciaBalance,
  getMenorSaldo,
  getMaiorSaldo,
  privade99,
};
