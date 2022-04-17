import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {No, Yes} from '../static/myIcon';
import {Text} from 'native-base';
import {
  defaultColor as deColor,
  errorColor,
  acceptColor,
} from '../static/color';

interface InputProps extends Omit<TextInputProps, 'style'> {
  iconSide: 'none' | 'left' | 'right';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  icon?: object | Array<object>;
  // 正则规则
  rules?: RegExp | boolean | Array<RegExp | boolean | undefined>;
  errText?: Array<string> | string;
  /* 
    对于文本确认，无法使用change函数进行判断，因此需要通过直接传入文本信息进行校验
  */
  confirm?: boolean;
  confirmText?: string;
  confirmErrorText?: string;

  // 是否可用
  unable?: boolean;

  getState?: (e: {[key: string]: any}) => void;
}

const defaultSize = {height: 40, width: 200};

// 判断rules形式
const getRules = (
  // rules的形式（可以匹配正则，布尔变量，以及rule数组，如果有undefined则按默认显示）
  rules: RegExp | boolean | Array<RegExp | boolean | undefined>,

  // 正则匹配时的字符串
  text?: string,
): boolean | Array<number> | undefined => {
  // boolean形式
  if (typeof rules === 'boolean') {
    return !!(rules as boolean);
  }
  // 数组形式
  else if (rules.constructor === Array) {
    let res: number[] | undefined = [];
    let index = 0;
    for (const e of rules) {
      if (e === undefined) {
        return undefined;
      } else if (!getRules(e, text)) {
        res!.push(index);
      }
      index++;
    }
    return res;

    // 正则形式
  } else {
    return (rules as RegExp).test(text!) as boolean;
  }
};

export default function Input(props: InputProps) {
  const defaultColor = {
    default: deColor,
    accept: acceptColor,
    error: errorColor,
  };

  const number = {
    default: 0,
    accept: 1,
    error: 2,
  };

  // input的不同模式
  const [situ, setSitu] = useState<keyof typeof defaultColor>('default');

  // 正则判断错误所显示的文本
  const [errNo, setErrNo] = useState<number>(-1);
  const [text, setText] = useState<string>('');
  const didMount = useRef(false);

  const {
    iconSide,
    containerStyle,
    textStyle,
    onChangeText,
    rules,
    errText,

    // 类型为数组，传入默认、正确、错误的icon图标
    icon,

    confirm,
    confirmText,
    confirmErrorText,
    getState,

    unable,
  } = props;

  const cStyle = {...(containerStyle as Object)};
  const tStyle = {...(textStyle as Object)};

  // rule判断（为数组）
  useEffect(() => {
    if (rules !== undefined && didMount.current) {
      const res = getRules(rules, text);
      if (typeof res === 'boolean') {
        setSitu(res ? 'accept' : 'error');
        setErrNo(res ? -1 : 0);
      } else if (typeof res === 'object') {
        setSitu(res.length === 0 ? 'accept' : 'error');
        setErrNo(res[0] !== undefined ? res[0] : -1);
      }
    }
    didMount.current = true;
  });

  // layout
  useEffect(() => {
    getState && getState({err: errNo !== -1});
  }, [errNo]);

  // borderColor
  let borderColor =
    situ === 'default' && containerStyle?.borderColor
      ? containerStyle?.borderColor
      : defaultColor[situ];

  return (
    <View>
      {/* input容器 */}
      <View
        style={{
          ...styles.container,
          ...cStyle,
          flexDirection: iconSide === 'right' ? 'row-reverse' : 'row',
          borderColor: borderColor,
        }}>
        {unable && <View style={[styles.unable,{width:containerStyle?.width||'120%'}]}/>}
        {/* icon */}
        {(icon &&
          ((icon.constructor === Array &&
            (icon as Array<object>)[number[situ]]) ||
            icon)) ||
          (iconSide !== 'none' && (
            <View style={styles.icon}>
              {situ === 'error' ? (
                <No color={defaultColor[situ]} size={5} />
              ) : (
                <Yes color={defaultColor[situ]} size={5} />
              )}
            </View>
          ))}

        {/* input框 */}
        <TextInput
          {...props}
          style={{...styles.input, ...tStyle, height: containerStyle?.height}}
          onChangeText={e => {
            setText(e);
            onChangeText && onChangeText(e);
            if (rules !== undefined) {
              const res = getRules(rules, e);
              if (typeof res === 'boolean') {
                setSitu(res ? 'accept' : 'error');
                setErrNo(res ? -1 : 0);
              } else if (typeof res === 'object') {
                setSitu(res.length === 0 ? 'accept' : 'error');
                setErrNo(res[0] !== undefined ? res[0] : -1);
              }
            }
            if (confirm) {
              setSitu(confirmText === e ? 'accept' : 'error');
              setErrNo(confirmText === e ? -1 : errText?.length || 0);
            }
          }}
        />
      </View>
      {/* 错误信息 */}
      {errNo != -1 && (
        <Text style={{color: defaultColor['error']}}>
          *
          {confirmErrorText ||
            (typeof errText === 'string' && errText) ||
            errText![errNo] ||
            'error'}
        </Text>
      )}
    </View>
  );
}

Input.defaultProps = {
  iconSide: 'left',
  errText: ['error'],
  confirm: false,
  confirmText: '',
  confirmErrorText: '',
  unable: false,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    width: defaultSize.width,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  icon: {},
  input: {
    height: defaultSize.height,
    flex: 1,
  },
  unable: {
    position: 'absolute',
    zIndex:9,
    backgroundColor:'black',
    height:'100%',
    opacity: 0.5
  },
});
