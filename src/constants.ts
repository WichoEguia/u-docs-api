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

export interface PaypalBillingPlan {
  id?: string,
  name: string,
  description: string,
  type: 'FIXED' | 'INFINITE',
  payment_definitions?: PaymentDefinitions[],
  merchant_preferences?: {
    setup_fee?: any,
    cancel_url: string,
    return_url: string,
    max_fail_attempts?: string,
    auto_bill_amount?: 'NO' | 'YES',
    initial_fail_amount_action?: 'CONTINUE' | 'CANCEL'
  }
}