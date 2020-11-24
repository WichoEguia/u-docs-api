export enum AppRoles {
  INSTRUCTOR = 'Instructor',
  STUDENT = 'Student'
}

export enum TrainingTypes {
  PRIVATE = 'Private',
  PUBLIC = 'Public'
}

export enum PaymentMethods {
  PAYPAL = 'Paypal',
  OPENPAY = 'Openpay'
}

export interface PaymentDefinitions {
  name: string,
  type: 'TRIAL' | 'REGULAR',
  frequency_interval: string,
  frequency: 'WEEK' | 'DAY' | 'YEAR' | 'MONTH',
  cycles: string,
  amount: any,
  charge_models?: any[]
}

export interface PayPalLinks {
  href: string,
  rel: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'PATCH'
}

export interface PaypalBillingPlan {
  id?: string,
  name: string,
  description: string,
  type: 'FIXED' | 'INFINITE',
  state?: 'CREATED' | 'ACTIVE' | 'INACTIVE' | 'DELETED',
  create_time?: string,
  update_time?: string,
  payment_definitions?: PaymentDefinitions[],
  merchant_preferences?: {
    setup_fee?: any,
    cancel_url: string,
    return_url: string,
    max_fail_attempts?: string,
    auto_bill_amount?: 'NO' | 'YES',
    initial_fail_amount_action?: 'CONTINUE' | 'CANCEL'
  },
  terms?: any[],
  currency_code?: string
  links?: PayPalLinks[]
}

export interface PaypalBillingAgreement {
  id?: string,
  state?: 'Pending' | 'Active' | 'Suspended' | 'Cancelled' | 'Expired',
  name: string,
  description: string,
  start_date: string,
  agreement_details?: {
    outstanding_balance?: {
      currency: string,
      value: string
    },
    cycles_remaining?: string,
    cycles_completed?: string,
    next_billing_date?: string,
    last_payment_date?: string,
    last_payment_amount?: {
      currency: string,
      value: string
    },
    final_payment_date?: string,
    failed_payment_count?: string
  },
  payer: any,
  shipping_address?: any,
  override_merchant_preferences?: any,
  override_charge_models?: any[],
  plan: {
    id: string
  },
  links?: PayPalLinks[]
}