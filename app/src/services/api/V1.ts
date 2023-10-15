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

import {
  ApiAnalytic,
  ApiAnalyticControllerGetAnalyticsParamsOrderEnum,
  ApiCreateInviteDto,
  ApiCreatePollDto,
  ApiCreateVoteDto,
  ApiDeleteInviteDto,
  ApiGetVotesDao,
  ApiInviteEntity,
  ApiPageDto,
  ApiPollControllerGetPollsParamsOrderEnum,
  ApiPollControllerGetPublicPollsParamsOrderEnum,
  ApiPollEntity,
  ApiUpdatePollDto,
  ApiUpdateUserDto,
  ApiUserEntity,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class V1<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags Health
   * @name HealthControllerGetHealth
   * @request GET:/v1/health
   */
  healthControllerGetHealth = (params: RequestParams = {}) =>
    this.http.request<string, any>({
      path: `/v1/health`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerGetUser
   * @request GET:/v1/users
   * @secure
   */
  userControllerGetUser = (params: RequestParams = {}) =>
    this.http.request<ApiUserEntity, any>({
      path: `/v1/users`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerUpdateUser
   * @request PUT:/v1/users
   * @secure
   */
  userControllerUpdateUser = (data: ApiUpdateUserDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/users`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerDeleteUser
   * @request DELETE:/v1/users
   * @secure
   */
  userControllerDeleteUser = (params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/users`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerGetUserById
   * @request GET:/v1/users/{userId}
   * @secure
   */
  userControllerGetUserById = (userId: string, params: RequestParams = {}) =>
    this.http.request<ApiUserEntity, any>({
      path: `/v1/users/${userId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Polls
   * @name PollControllerGetPolls
   * @request GET:/v1/polls
   * @secure
   */
  pollControllerGetPolls = (
    query?: {
      /** @default "ASC" */
      order?: ApiPollControllerGetPollsParamsOrderEnum;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * @min 1
       * @max 50
       * @default 10
       */
      take?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiPageDto & {
        data: ApiPollEntity[];
      },
      any
    >({
      path: `/v1/polls`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Polls
   * @name PollControllerCreatePoll
   * @request POST:/v1/polls
   * @secure
   */
  pollControllerCreatePoll = (data: ApiCreatePollDto, params: RequestParams = {}) =>
    this.http.request<ApiPollEntity, any>({
      path: `/v1/polls`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Polls
   * @name PollControllerGetPublicPolls
   * @request GET:/v1/polls/public
   */
  pollControllerGetPublicPolls = (
    query?: {
      /** @default "ASC" */
      order?: ApiPollControllerGetPublicPollsParamsOrderEnum;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * @min 1
       * @max 50
       * @default 10
       */
      take?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiPageDto & {
        data: ApiPollEntity[];
      },
      any
    >({
      path: `/v1/polls/public`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Polls
   * @name PollControllerGetPollById
   * @request GET:/v1/polls/{pollId}
   * @secure
   */
  pollControllerGetPollById = (pollId: string, params: RequestParams = {}) =>
    this.http.request<ApiPollEntity, any>({
      path: `/v1/polls/${pollId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Polls
   * @name PollControllerUpdatePoll
   * @request PUT:/v1/polls/{pollId}
   * @secure
   */
  pollControllerUpdatePoll = (pollId: string, data: ApiUpdatePollDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/polls/${pollId}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Polls
   * @name PollControllerDeletePoll
   * @request DELETE:/v1/polls/{pollId}
   * @secure
   */
  pollControllerDeletePoll = (pollId: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/polls/${pollId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Polls
   * @name PollControllerClosePoll
   * @request PUT:/v1/polls/{pollId}/close
   * @secure
   */
  pollControllerClosePoll = (pollId: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/polls/${pollId}/close`,
      method: 'PUT',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Votes
   * @name VoteControllerGetVotesByPoll
   * @request GET:/v1/votes/{pollId}
   * @secure
   */
  voteControllerGetVotesByPoll = (pollId: string, params: RequestParams = {}) =>
    this.http.request<ApiGetVotesDao, any>({
      path: `/v1/votes/${pollId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Votes
   * @name VoteControllerCreateVote
   * @request POST:/v1/votes/{pollId}
   * @secure
   */
  voteControllerCreateVote = (pollId: string, data: ApiCreateVoteDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/votes/${pollId}`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Analytics
   * @name AnalyticControllerGetAnalytics
   * @request GET:/v1/analytics
   */
  analyticControllerGetAnalytics = (
    query?: {
      /** @default "ASC" */
      order?: ApiAnalyticControllerGetAnalyticsParamsOrderEnum;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * @min 1
       * @max 50
       * @default 10
       */
      take?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiPageDto & {
        data: ApiAnalytic[];
      },
      any
    >({
      path: `/v1/analytics`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Analytics
   * @name AnalyticControllerGetAnalyticByPoll
   * @request GET:/v1/analytics/{pollId}
   */
  analyticControllerGetAnalyticByPoll = (pollId: string, params: RequestParams = {}) =>
    this.http.request<ApiAnalytic, any>({
      path: `/v1/analytics/${pollId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Invites
   * @name InviteControllerCreateInvite
   * @request POST:/v1/invites/{pollId}
   * @secure
   */
  inviteControllerCreateInvite = (pollId: string, data: ApiCreateInviteDto, params: RequestParams = {}) =>
    this.http.request<ApiInviteEntity, any>({
      path: `/v1/invites/${pollId}`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Invites
   * @name InviteControllerDeletePoll
   * @request DELETE:/v1/invites/{pollId}
   * @secure
   */
  inviteControllerDeletePoll = (pollId: string, data: ApiDeleteInviteDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/invites/${pollId}`,
      method: 'DELETE',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
