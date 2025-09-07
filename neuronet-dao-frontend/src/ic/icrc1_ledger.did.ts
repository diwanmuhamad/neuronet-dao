export const idlFactory = ({ IDL }: any) => {
  const Subaccount = IDL.Opt(IDL.Vec(IDL.Nat8));
  const Account = IDL.Record({ owner: IDL.Principal, subaccount: Subaccount });

  const Timestamp = IDL.Nat64;
  const Memo = IDL.Opt(IDL.Vec(IDL.Nat8));
  const Fee = IDL.Opt(IDL.Nat);

  const TransferArg = IDL.Record({
    from_subaccount: Subaccount,
    to: Account,
    amount: IDL.Nat,
    fee: Fee,
    memo: Memo,
    created_at_time: IDL.Opt(Timestamp),
  });

  const TransferError = IDL.Variant({
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
    TooOld: IDL.Null,
    CreatedInFuture: IDL.Record({ ledger_time: Timestamp }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    TemporarilyUnavailable: IDL.Null,
    GenericError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
  });

  const TransferResult = IDL.Variant({ Ok: IDL.Nat, Err: TransferError });

  return IDL.Service({
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], []),
    icrc1_transfer: IDL.Func([TransferArg], [TransferResult], []),
  });
};

export const init = () => {
  return [];
};
