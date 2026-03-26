import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
const WIDE = 1024;

function TabBarMaybe(props: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  if (width >= WIDE) return null;
  return <BottomTabBar {...props} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBarMaybe {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E7EB',
        },
        tabBarActiveTintColor: '#6347D1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: { fontFamily: 'DMSans_600SemiBold', fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Pickup',
          tabBarIcon: ({ color, size }) => <Ionicons name="location-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="leagues"
        options={{
          title: 'League',
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Coaching',
          tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="coming-soon"
        options={{
          title: 'Soon',
          tabBarIcon: ({ color, size }) => <Ionicons name="hourglass-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
