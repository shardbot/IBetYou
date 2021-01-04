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
    /**
     * Returns the payments owed to an address.
     * @param dest The creditor's address.
     */
    payments(dest: string): NonPayableTransactionObject<string>;

    /**
     * Withdraw accumulated payments, forwarding all gas to the recipient. Note that _any_ account can call this function, not just the `payee`. This means that contracts unaware of the `PullPayment` protocol can still receive funds this way, by having a separate account call {withdrawPayments}. WARNING: Forwarding all gas opens the door to reentrancy vulnerabilities. Make sure you trust the recipient, or are either following the checks-effects-interactions pattern or using {ReentrancyGuard}.
     * @param payee Whose payments will be withdrawn.
     */
    withdrawPayments(payee: string): NonPayableTransactionObject<void>;

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
    addBettorJudge(): NonPayableTransactionObject<void>;

    /**
     * Assigns caller as a counter bettor's judge
     */
    addCounterBettorJudge(): NonPayableTransactionObject<void>;

    /**
     * Judge or admin can call this function to vote for bettor
     */
    voteForBettor(): NonPayableTransactionObject<void>;

    /**
     * Judge or admin can call this function to vote for counter bettor
     */
    voteForCounterBettor(): NonPayableTransactionObject<void>;

    /**
     * Transfers this contract's balance to caller if he won this bet
     */
    claimReward(): NonPayableTransactionObject<void>;

    /**
     * Returns bet description
     */
    getBet(): NonPayableTransactionObject<{
      description: string;
      betState: string;
      expirationTime: string;
      deposit: string;
      0: string;
      1: string;
      2: string;
      3: string;
    }>;

    getBalance(): NonPayableTransactionObject<string>;
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