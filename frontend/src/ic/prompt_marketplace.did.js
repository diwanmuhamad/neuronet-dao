import { IDL } from '@dfinity/candid';

export const idlFactory = ({ IDL }) => {
  const Comment = IDL.Record({
    id: IDL.Nat,
    itemId: IDL.Nat,
    author: IDL.Principal,
    content: IDL.Text,
    createdAt: IDL.Int,
    updatedAt: IDL.Int,
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
    category: IDL.Text, // Added category field
    metadata: IDL.Text,
    comments: IDL.Vec(Comment),
    averageRating: IDL.Float64,
    totalRatings: IDL.Nat,
    createdAt: IDL.Int,
    updatedAt: IDL.Int,
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
    createdAt: IDL.Int,
    updatedAt: IDL.Int,
    expiration: IDL.Opt(IDL.Int)
  });

  const Favorite = IDL.Record({
    id: IDL.Nat,
    itemId: IDL.Nat,
    user: IDL.Principal,
    createdAt: IDL.Int,
  });

  const View = IDL.Record({
    id: IDL.Nat,
    itemId: IDL.Nat,
    viewer: IDL.Principal,
    createdAt: IDL.Int,
  });
  
  const User = IDL.Record({
    principal: IDL.Principal,
    balance: IDL.Nat,
    firstName: IDL.Opt(IDL.Text),
    lastName: IDL.Opt(IDL.Text),
    bio: IDL.Opt(IDL.Text),
    rate: IDL.Opt(IDL.Nat),
    createdAt: IDL.Int,
    updatedAt: IDL.Int,
  });

  return IDL.Service({
    register_user: IDL.Func([], [IDL.Bool], []),
    list_item: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    create_item_for_user: IDL.Func([IDL.Principal, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    get_items: IDL.Func([], [IDL.Vec(Item)], ['query']),
    get_item_detail: IDL.Func([IDL.Nat], [IDL.Opt(ItemDetail)], ['query']),
    add_comment: IDL.Func([IDL.Nat, IDL.Text, IDL.Nat], [IDL.Opt(IDL.Nat)], []),
    get_comments_by_item: IDL.Func([IDL.Nat], [IDL.Vec(Comment)], ['query']),
    buy_item: IDL.Func([IDL.Nat], [IDL.Opt(IDL.Nat)], []),
    get_my_licenses: IDL.Func([], [IDL.Vec(License)], []),
    get_licenses_by_item: IDL.Func([IDL.Nat], [IDL.Vec(License)], ['query']),
    add_favorite: IDL.Func([IDL.Nat], [IDL.Opt(IDL.Nat)], []),
    remove_favorite: IDL.Func([IDL.Nat], [IDL.Bool], []),
    is_favorited: IDL.Func([IDL.Nat], [IDL.Bool], []),
    get_favorites_by_item: IDL.Func([IDL.Nat], [IDL.Vec(Favorite)], ['query']),
    get_my_favorites: IDL.Func([], [IDL.Vec(Favorite)], []),
    get_favorite_count: IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    get_total_favorite_count: IDL.Func([], [IDL.Nat], ['query']),
    add_view: IDL.Func([IDL.Nat], [IDL.Nat], []),
    get_views_by_item: IDL.Func([IDL.Nat], [IDL.Vec(View)], ['query']),
    get_view_count: IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    get_unique_view_count: IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    get_total_view_count: IDL.Func([], [IDL.Nat], ['query']),
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
    get_items_by_category: IDL.Func([IDL.Text], [IDL.Vec(Item)], ['query']),
    get_user_profile: IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    get_my_profile: IDL.Func([], [IDL.Opt(User)], []),
    update_user_profile: IDL.Func([IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat)], [IDL.Bool], []),
    get_items_by_user: IDL.Func([IDL.Principal], [IDL.Vec(Item)], ['query']),
    get_comments_by_user: IDL.Func([IDL.Principal], [IDL.Vec(Comment)], ['query']),
  });
}; 