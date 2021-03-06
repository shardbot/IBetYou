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

export interface Exchange extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Exchange;
  clone(): Exchange;
  methods: {
    MATIC(): NonPayableTransactionObject<string>;

    USDC(): NonPayableTransactionObject<string>;

    maUSDC(): NonPayableTransactionObject<string>;

    /**
     * Swaps MATIC(ETH) tokens for maUSDC tokens
     * @param _unixTime If transaction is not mined and unixTime has expire, transaction will revert
     */
    swapMaticForMaUSDC(
      _unixTime: number | string | BN
    ): PayableTransactionObject<void>;

    /**
     * Swaps maUSDC tokens for MATIC(ETH) tokens
     * @param _unixTime If transaction is not mined and unixTime has expire, transaction will revert
     */
    swapMaUSDCForMatic(
      _unixTime: number | string | BN
    ): NonPayableTransactionObject<void>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
