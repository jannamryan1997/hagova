export class CsvUserData {
  firstName: string;
  lastName: string;
  phoneNum: string;
  email: string;
  debtSum: number;
  debtSumAgorot: number;
  debtDate: Date;
  addressStreet: string;
  addressCity: string;
}

export class UserUpdateData {
  firstName: string;
  lastName: string;
  phoneNum: string;
  bankNum: string;
  bankName: string;
  bankLocationNum: string;
}

export class UserNewEmailAndPass {
  newEmail: string;
  newPassword: string;
  newPassword2: string;
}
