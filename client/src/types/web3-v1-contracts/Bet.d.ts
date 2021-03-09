/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type Action = ContractEventLog<{
  _sender: string;
  _roleName: string;
  _action: string;
  0: string;
  1: string;
  2: string;
}>;
export type CurrentState = ContractEventLog<{
  _betState: string;
  0: string;
}>;
export type Dispute = ContractEventLog<{}>;

export interface Bet extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Bet;
  clone(): Bet;
  methods: {
    maUSDC(): NonPayableTransactionObject<string>;

    /**
     * Constructor replacement
     */
    init(
      _admin: string,
      _deposit: number | string | BN,
      _description: string,
      _expirationTime: number | string | BN,
      _mapperAddress: string,
      _exchangeAddress: string
    ): NonPayableTransactionObject<void>;

    /**
     * Assigns caller as bettor
     */
    addBettor(): PayableTransactionObject<void>;

    /**
     * Assigns caller as counter bettor
     */
    addCounterBettor(): PayableTransactionObject<void>;

    /**
     * Assigns caller as a bettor's judge
     */
    addBettorJudge(
      _txExpirationTime: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * Assigns caller as a counter bettor's judge
     */
    addCounterBettorJudge(
      _txExpirationTime: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * Judge or admin can call this function to vote for bettor
     */
    voteForBettor(
      _txExpirationTime: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * Judge or admin can call this function to vote for counter bettor
     */
    voteForCounterBettor(
      _txExpirationTime: number | string | BN
    ): NonPayableTransactionObject<void>;

    /**
     * Transfers this contract's balance to caller if he won this bet
     */
    claimReward(): NonPayableTransactionObject<void>;

    /**
     * Returns if _address voted
     * @param _address address to be checked
     */
    didVote(_address: string): NonPayableTransactionObject<boolean>;

    /**
     * Returns bet description
     */
    getBet(): NonPayableTransactionObject<{
      betAddress: string;
      description: string;
      betState: string;
      expirationTime: string;
      deposit: string;
      winner: string;
      didFarmYield: boolean;
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: boolean;
    }>;
  };
  events: {
    Action(cb?: Callback<Action>): EventEmitter;
    Action(options?: EventOptions, cb?: Callback<Action>): EventEmitter;

    CurrentState(cb?: Callback<CurrentState>): EventEmitter;
    CurrentState(
      options?: EventOptions,
      cb?: Callback<CurrentState>
    ): EventEmitter;

    Dispute(cb?: Callback<Dispute>): EventEmitter;
    Dispute(options?: EventOptions, cb?: Callback<Dispute>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "Action", cb: Callback<Action>): void;
  once(event: "Action", options: EventOptions, cb: Callback<Action>): void;

  once(event: "CurrentState", cb: Callback<CurrentState>): void;
  once(
    event: "CurrentState",
    options: EventOptions,
    cb: Callback<CurrentState>
  ): void;

  once(event: "Dispute", cb: Callback<Dispute>): void;
  once(event: "Dispute", options: EventOptions, cb: Callback<Dispute>): void;
}
