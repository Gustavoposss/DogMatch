import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../styles/colors';
import LogoSvg from '../../assets/logopardepatas-clean.svg';

interface LogoProps {
	width?: number;
	height?: number;
	color?: string; // não usado no SVG, mantido por compatibilidade
	style?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({ width = 120, height = 120, style }) => {
	return (
		<View style={[styles.container, style]}>
			<LogoSvg width={width} height={height} />
		</View>
	);
};

// Logo simplificada para uso em headers
export const LogoIcon: React.FC<LogoProps> = ({ width = 32, height = 32, style }) => {
	return (
		<View style={[styles.container, style]}>
			<LogoSvg width={width} height={height} />
		</View>
	);
};

// Logo com "gradiente" (opcional: pode-se envolver em container colorido)
export const LogoGradient: React.FC<LogoProps> = ({ width = 120, height = 120, style }) => {
	return (
		<View style={[style]}>
			<LogoSvg width={width} height={height} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});