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

export type PayeeAdded = ContractEventLog<{
  account: string;
  shares: string;
  0: string;
  1: string;
}>;
export type PaymentReceived = ContractEventLog<{
  from: string;
  amount: string;
  0: string;
  1: string;
}>;
export type PaymentReleased = ContractEventLog<{
  to: string;
  amount: string;
  0: string;
  1: string;
}>;

export interface PaymentSplitter extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): PaymentSplitter;
  clone(): PaymentSplitter;
  methods: {
    /**
     * Getter for the total shares held by payees.
     */
    totalShares(): NonPayableTransactionObject<string>;

    /**
     * Getter for the total amount of Ether already released.
     */
    totalReleased(): NonPayableTransactionObject<string>;

    /**
     * Getter for the amount of shares held by an account.
     */
    shares(account: string): NonPayableTransactionObject<string>;

    /**
     * Getter for the amount of Ether already released to a payee.
     */
    released(account: string): NonPayableTransactionObject<string>;

    /**
     * Getter for the address of the payee number `index`.
     */
    payee(index: number | string | BN): NonPayableTransactionObject<string>;

    /**
     * Triggers a transfer to `account` of the amount of Ether they are owed, according to their percentage of the total shares and their previous withdrawals.
     */
    release(account: string): NonPayableTransactionObject<void>;
  };
  events: {
    PayeeAdded(cb?: Callback<PayeeAdded>): EventEmitter;
    PayeeAdded(options?: EventOptions, cb?: Callback<PayeeAdded>): EventEmitter;

    PaymentReceived(cb?: Callback<PaymentReceived>): EventEmitter;
    PaymentReceived(
      options?: EventOptions,
      cb?: Callback<PaymentReceived>
    ): EventEmitter;

    PaymentReleased(cb?: Callback<PaymentReleased>): EventEmitter;
    PaymentReleased(
      options?: EventOptions,
      cb?: Callback<PaymentReleased>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "PayeeAdded", cb: Callback<PayeeAdded>): void;
  once(
    event: "PayeeAdded",
    options: EventOptions,
    cb: Callback<PayeeAdded>
  ): void;

  once(event: "PaymentReceived", cb: Callback<PaymentReceived>): void;
  once(
    event: "PaymentReceived",
    options: EventOptions,
    cb: Callback<PaymentReceived>
  ): void;

  once(event: "PaymentReleased", cb: Callback<PaymentReleased>): void;
  once(
    event: "PaymentReleased",
    options: EventOptions,
    cb: Callback<PaymentReleased>
  ): void;
}
