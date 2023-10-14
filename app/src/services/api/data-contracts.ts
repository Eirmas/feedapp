/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiUserEntity {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiUpdateUserDto {
  name?: string;
  avatar?: string;
}

export interface ApiPaginateDto {
  skip?: number;
  take?: number;
}

export interface ApiPollEntity {
  id: string;
  ownerId: string;
  title: string;
  question: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
  status: ApiPollEntityStatusEnum;
  invites: string[];
}

export interface ApiCreatePollDto {
  title: string;
  question: string;
  private?: boolean;
  emails?: string[];
}

export interface ApiUpdatePollDto {
  title?: string;
  question?: string;
  private?: boolean;
}

export interface ApiGetVotesDao {
  yes: number;
  no: number;
}

export interface ApiCreateVoteDto {
  answer: boolean;
}

export interface ApiAnalytic {
  _id: string;
  title: string;
  question: string;
  yes: number;
  no: number;
  created: number;
}

export interface ApiCreateInviteDto {
  email: string;
}

export interface ApiInviteEntity {
  pollId: string;
  email: string;
  createdAt: string;
}

export interface ApiDeleteInviteDto {
  email: string;
}

export enum ApiPollEntityStatusEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
