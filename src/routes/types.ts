import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Book } from 'contexts/booksContext';

export enum RouteName {
  Discover = 'Explorar',
  Library = 'Biblioteca',
  Home = 'Home',
  Reading = 'Reading',
  BookList = 'BookList',
}

export type TabRouteParamList = {
  [RouteName.Discover]: undefined;
  [RouteName.Library]: undefined;
};

export type StackRouteParamList = {
  [RouteName.Home]: NavigatorScreenParams<TabRouteParamList>;
  [RouteName.Reading]: { book: Book };
  [RouteName.BookList]: { title: string; books: Book[] };
};

export type RouteParamList = TabRouteParamList & StackRouteParamList;

export type RouteParams<RouteName extends keyof RouteParamList> =
  RouteName extends keyof TabRouteParamList
    ? BottomTabScreenProps<TabRouteParamList, RouteName>
    : RouteName extends keyof StackRouteParamList
    ? NativeStackScreenProps<StackRouteParamList, RouteName>
    : never;

export type StackNavigation = NativeStackNavigationProp<StackRouteParamList>;
