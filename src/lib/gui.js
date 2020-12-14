import {Dimensions, Platform} from 'react-native'

const {width, height} = Dimensions.get('window');

export const gui = {
    mainColor: "#21209c",
    linearMain: ['#34626c','#839b97'],
    linearButton: ['rgb(255,194,38)','rgb(246,73,36)'],
    linearMinus: ['#8d8e9d','#c1c1cc'],
    linearPlus: ['#3366ff','#629fff'],
    headerHeight: Platform.OS === 'ios' ? 87 : 58,
    normalFontSize: 14,
    colorText: '#4b515d',
    smallFontSize: 13,
    memSizeText: 15,
    titleFontSize: 17,
    screenWidth: width < height ? width : height,
    screenHeight: width < height ? height : width,
    navBarHeight: Platform.OS === 'ios' ? ((height === 812 || width === 812 || height === 896 || width === 896) ? 80 : 64) : 44, // check navBarHeight iphone X, Xm
    marginTop: Platform.OS === 'ios' ? ((height === 812 || width === 812 || height === 896 || width === 896) ? 34 : 18) : 6,
    iconTop: Platform.OS === 'ios' ? 28 : 12,
    ERR_NoInternetConnection: "Không có kết nối internet!",
    ERR_LoiKetNoiMayChu : "Yêu cầu của bạn tạm thời không thực hiện được. Vui lòng thực hiện lại sau!",
    INF_CameraAccess: "Bạn cần vào Cài đặt -> QLKLotus -> Bật cho phép QLKLotus truy cập ảnh, camera",
    INF_LocationAccess: "Bạn cần vào Cài đặt -> QLKLotus -> Bật cho phép QLKLotus truy cập vị trí",
    INF_PhotoAccess: "Bạn cần vào Cài đặt -> QLKLotus -> Bật cho phép QLKLotus truy cập ảnh",
};

export default gui;