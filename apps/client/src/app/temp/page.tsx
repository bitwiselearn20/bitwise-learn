'use client'

import Attempt from '@/component/attempt/Attempt'
import SideBar from '@/component/general/SideBar'
import ThemeSwitcher from '@/component/general/(Color Manager)/ThemeSwitcher'
import { useTheme } from '@/component/general/(Color Manager)/ThemeController'
import { useColors } from '@/component/general/(Color Manager)/useColors'
import Footer from '@/component/general/Footer'
import AddAssignment from '@/component/(admin-course-pages)/add-assignment/AddAssignment'


export default function page() {
    const { theme } = useTheme();
    const Colors = useColors();
  return (
    // <div className='h-full'>
    //     <SideBar />
    //     <ThemeSwitcher />
    //     <h1 className={`text-5xl font-bold ${Colors.text.primary}`}>Hello Sir</h1>
    //     <Footer />

    // </div>
    <div>
      {/* <AddAssignment /> */}
    </div>
  )
}
