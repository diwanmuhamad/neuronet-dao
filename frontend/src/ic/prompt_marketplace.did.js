import { IDL } from '@dfinity/candid';

export const idlFactory = ({ IDL }) => {
  const ItemType = IDL.Variant({ Prompt: null, Dataset: null });
  const Item = IDL.Record({
    id: IDL.Nat,
    owner: IDL.Principal,
    title: IDL.Text,
    description: IDL.Text,
    price: IDL.Nat,
    itemType: ItemType,
    metadata: IDL.Text,
  });
  const License = IDL.Record({
    id: IDL.Nat,
    itemId: IDL.Nat,
    buyer: IDL.Principal,
    timestamp: IDL.Int,
    expiration: IDL.Opt(IDL.Int),
  });
  return IDL.Service({
    register_user: IDL.Func([], [IDL.Bool], []),
    list_item: IDL.Func([IDL.Text, IDL.Text, IDL.Nat, ItemType, IDL.Text], [IDL.Nat], []),
    get_items: IDL.Func([], [IDL.Vec(Item)], ['query']),
    buy_item: IDL.Func([IDL.Nat], [IDL.Opt(IDL.Nat)], []),
    get_my_licenses: IDL.Func([], [IDL.Vec(License)], ['query']),
  });
}; 