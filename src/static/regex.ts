export const passwordRule: RegExp=/^(?![a-z]+$)(?![A-Z]+$)(?![0-9]+$)(?![@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{8,16}$/
export const phoneNumRule: RegExp=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
export const emptyRule:RegExp=/^(?!$)/
export const usernameRule: RegExp=/^[A-Za-z0-9_]{4,16}/