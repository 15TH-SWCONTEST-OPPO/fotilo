import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React, {useState} from 'react';
import {No, Yes} from '../static/myIcon';
import {Text} from 'native-base';

interface InputProps extends Omit<TextInputProps, 'style'> {
  iconSide: 'none' | 'left' | 'right';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  icon?: any;
  // 正则规则
  rules?: RegExp | boolean | Array<RegExp | boolean>;
  errText?: Array<string>;
}

const defaultSize = {height: 40, width: 200};

// 判断rules形式
const getRules = (
  // rules的形式（可以匹配正则，布尔变量，以及rule数组）
  rules: RegExp | boolean | Array<RegExp | boolean>,

  // 正则匹配时的字符串
  text?: string,
): boolean | Array<number> => {
  // boolean形式
  if (typeof rules === 'boolean') return rules;
  // 数组形式
  else if (rules.constructor === Array) {
    let res: number[] = [];
    rules.map((e, index) => {
      if (!getRules(e, text)) {
        res.push(index);
      }
    });
    return res;

    // 正则形式
  } else {
    return (rules as RegExp).test(text!);
  }
};

export default function Input(props: InputProps) {
  const defaultColor = {
    default: '#c0c0c0',
    accept: '#6dbe4b',
    error: '#d75246',
  };

  const [situ, setSitu] = useState<keyof typeof defaultColor>('default');
  const [errNo, setErrNo] = useState<number>(-1);

  const {
    iconSide,
    containerStyle,
    textStyle,
    onChangeText,
    rules,
    errText,
    icon,
  } = props;

  const cStyle = {...(containerStyle as Object)};
  const tStyle = {...(textStyle as Object)};

  return (
    <View>

      {/* input容器 */}
      <View
        style={{
          borderColor: defaultColor[situ],
          ...styles.container,
          ...cStyle,
          flexDirection: iconSide === 'right' ? 'row-reverse' : 'row',
        }}>
        {/* icon */}
        {icon ||
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
            if (rules !== undefined) {
              const res = getRules(rules, e);
              if (typeof res === 'boolean') setSitu(res ? 'accept' : 'error');
              else {
                setSitu(res.length === 0 ? 'accept' : 'error');
                setErrNo(res[0] !== undefined ? res[0] : -1);
              }
            }
            onChangeText && onChangeText(e);
          }}
        />
      </View>

      {/* 错误信息 */}
      {errNo != -1 && (
        <Text style={{color: defaultColor['error']}}>
          {errText![errNo] || 'error'}
        </Text>
      )}
      
    </View>
  );
}

Input.defaultProps = {
  iconSide: 'left',
  errText: [],
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    width: defaultSize.width,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {},
  input: {
    height: defaultSize.height,
    flex: 1,
  },
});
