import { IDL } from '@dfinity/candid';

export const idlFactory = ({ IDL }) => {
  const Comment = IDL.Record({
    id: IDL.Nat,
    itemId: IDL.Nat,
    author: IDL.Principal,
    content: IDL.Text,
    timestamp: IDL.Int,
    rating: IDL.Nat,
  });
  
  const Category = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    itemType: IDL.Text,
    description: IDL.Text,
  });
  
  // Define base item fields
  const ItemBase = {
    id: IDL.Nat,
    owner: IDL.Principal,
    title: IDL.Text,
    description: IDL.Text,
    price: IDL.Nat,
    itemType: IDL.Text,
    metadata: IDL.Text,
    comments: IDL.Vec(Comment),
    averageRating: IDL.Float64,
    totalRatings: IDL.Nat,
  };

  // Extend ItemBase for Item
  const Item = IDL.Record({
    ...ItemBase,
    content: IDL.Text,
  });

  // ItemDetail uses base fields directly
  const ItemDetail = IDL.Record(ItemBase);

  const License = IDL.Record({
    id: IDL.Nat,
    itemId: IDL.Nat,
    buyer: IDL.Principal,
    timestamp: IDL.Int,
    expiration: IDL.Opt(IDL.Int)
  });
  
  return IDL.Service({
    register_user: IDL.Func([], [IDL.Bool], []),
    list_item: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Text], [IDL.Nat], []),
    get_items: IDL.Func([], [IDL.Vec(Item)], ['query']),
    get_item_detail: IDL.Func([IDL.Nat], [IDL.Opt(ItemDetail)], ['query']),
    add_comment: IDL.Func([IDL.Nat, IDL.Text, IDL.Nat], [IDL.Opt(IDL.Nat)], []),
    buy_item: IDL.Func([IDL.Nat], [IDL.Opt(IDL.Nat)], []),
    get_my_licenses: IDL.Func([], [IDL.Vec(License)], []),
    get_balance: IDL.Func([], [IDL.Opt(IDL.Nat)], []),
    get_categories: IDL.Func([IDL.Opt(IDL.Text)], [IDL.Vec(Category)], ['query']),
    get_item_types: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    whoami: IDL.Func([], [IDL.Principal], []),
    get_item_count: IDL.Func([], [IDL.Nat], ['query']),
    get_user_count: IDL.Func([], [IDL.Nat], ['query']),
    get_license_count: IDL.Func([], [IDL.Nat], ['query']),
    search_items: IDL.Func([IDL.Text], [IDL.Vec(Item)], ['query']),
    get_items_by_owner: IDL.Func([], [IDL.Vec(Item)], []),
    get_items_by_type: IDL.Func([IDL.Text], [IDL.Vec(Item)], ['query']),
  });
}; 