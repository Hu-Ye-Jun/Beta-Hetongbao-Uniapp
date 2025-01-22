<template>
  <u-loading-page
    loading-color="#FFFFFF"
    loading-mode="spinner"
    color="#FFFFFF"
    bg-color="rgba(201, 201, 201, 0.5)"
    loading-text="正在全力加载中..."
    :loading="pageLoading"
  ></u-loading-page>
  <view class="contianer">
    <view class="topBg">
      <image
        class="bgImg"
        src="https://cdn.law.xiaomugua.cn/minip/templateBg.png"
      ></image>
    </view>
    <view style="padding: 80rpx 0">
      <view class="result">
        <image
          @tap="handleGoBack"
          style="
            width: 18rpx;
            height: 30rpx;
            margin-right: 20rpx;
            transform: rotate(180deg);
          "
          src="https://cdn.law.xiaomugua.cn/minip/back.png"
          mode="scaleToFill"
        ></image>
        <u-tabs
          @click="handleTab"
          lineWidth="20"
          :list="tabList"
          :itemStyle="{
            fontSize: '48rpx',
            fontWeight: 700,
            height: '60px',
          }"
        ></u-tabs>
      </view>
      <view style="padding: 0 30rpx" v-if="currentTabIndex === 0">
        <view
          class="collapse"
          v-for="(item, index) in reviewDetail"
          :key="index"
        >
          <uni-collapse accordion>
            <uni-collapse-item :open="open">
              <template v-slot:title>
                <view class="collapse-title">
                  {{ item.businessRisk }}
                </view>
              </template>
              <view class="collapse-subtitle">
                <view class="title">解释说明</view>
                <view class="text">
                  {{ item.details.proposedChanges }}
                </view>
              </view>
              <view class="collapse-subtitle">
                <view class="title">
                  <span
                    style="
                      background-color: rgba(5, 161, 108, 0.1);
                      padding: 0 8rpx;
                      border-radius: 8rpx;
                    "
                  >
                    <text style="color: #05a16c">修改建议</text>
                  </span>
                </view>
                <view class="text">
                  {{ item.details.modifiedContent }}
                </view>
              </view>
              <view style="padding-bottom: 30rpx" class="collapse-subtitle">
                <view class="title">相关法规</view>
                <view class="text">
                  {{ item.details.relatedRegulation }}
                </view>
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </view>
      </view>
      <view v-else>
        <view
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15rpx 0;
            padding: 0 30rpx;
          "
        >
          <view
            style="display: flex; align-items: center; padding: 20rpx 0"
            @tap="() => (pickerShowMainBody = true)"
          >
            <view style="margin-right: 10rpx">{{ selectedMainBodyName }}</view>
            <u-icon size="12px" color="#BBBBBB" name="arrow-down-fill"></u-icon>
          </view>
          <view>
            <button @click="handleMainBody" class="reviewBtn">审查主体</button>
          </view>
        </view>
        <u-picker
          :closeOnClickOverlay="true"
          :show="pickerShowMainBody"
          :columns="[companyNameList.map((contract) => contract)]"
          @confirm="handleMainBodyConfirm"
          @cancel="handlePickerCancel"
          @close="handlePickerCancel"
        ></u-picker>
        <view class="kindTips"
          >温馨提示：主体审查将消耗您的次数，目前剩余{{
            bodyReviewCount
          }}次</view
        >
        <view class="card">
          <view style="width: 130rpx">
            <u-avatar
              style="text-align: center"
              :size="55"
              font-size="16"
              bg-color="#4D6EF1"
              color="#fff"
              text="暂无头像"
              shape="square"
            ></u-avatar>
          </view>
          <view class="cardHeard">
            <view class="cardName">{{
              examination && examination.name
                ? examination.name
                : "暂无公司结果"
            }}</view>
            <view style="display: flex; margin-bottom: 15rpx">
              <view style="margin-right: 15rpx">
                <u-tag
                  color="#05A16C"
                  style="padding: 5rpx"
                  :text="
                    examination && examination.status
                      ? examination.status
                      : '暂无查询结果'
                  "
                  type="success"
                  plain
                ></u-tag>
              </view>
              <view>
                <u-tag
                  style="padding: 5rpx"
                  :text="
                    examination && examination.econKind
                      ? examination.econKind
                      : '暂无查询结果'
                  "
                  type="info"
                  plain
                ></u-tag>
              </view>
            </view>
            <view class="cardCode"
              >统一社会信用代码：{{
                examination && examination.creditCode
                  ? examination.creditCode
                  : "暂无结果"
              }}</view
            >
          </view>
        </view>
        <view class="bodyInfo">
          <view class="infoItem">
            <view class="itemTitle">法定代表人</view>
            <view class="itemText">
              {{
                examination && examination.operName
                  ? examination.operName
                  : "暂无结果"
              }}
            </view>
          </view>
          <view
            style="width: 0; height: 50rpx; border-right: 1px solid #ddd"
          ></view>
          <view class="infoItem">
            <view class="itemTitle">所属行业</view>
            <view class="itemText">
              {{
                examination && examination.industry
                  ? examination.industry
                  : "暂无结果"
              }}
            </view>
          </view>
          <view
            style="width: 0; height: 50rpx; border-right: 1px solid #ddd"
          ></view>
          <view class="infoItem">
            <view class="itemTitle">人员规模</view>
            <view class="itemText">
              {{
                examination && examination.personScope
                  ? examination.personScope
                  : "暂无结果"
              }}
            </view>
          </view>
        </view>
        <view class="addressBox">
          <image
            src="https://cdn.law.xiaomugua.cn/minip/address.png"
            mode=""
          ></image>
          <view>
            {{
              examination && examination.address
                ? examination.address
                : "注册地址暂无结果"
            }}
          </view>
        </view>
        <view style="height: 15rpx; background-color: #f4f4f4"></view>
        <view style="border-bottom: 1px solid #dddddd">
          <u-tabs
            @click="handleBodyTab"
            lineWidth="20"
            :list="bodyList"
            :itemStyle="{
              fontSize: '36rpx',
              fontWeight: 400,
              height: '50px',
            }"
            style="width: 100%"
            :activeStyle="{
              color: '#4D6EF1',
            }"
          ></u-tabs>
        </view>
        <view class="cardBox">
          <view
            class="collapseCardTitle"
            v-if="
              currentBodyTabIndex === 0 &&
              litigationInformation &&
              litigationInformation.length > 0
            "
          >
            存在{{
              examination && examination.litigationInformationSize
                ? examination.litigationInformationSize
                : 0
            }}条涉诉信息,
            <text style="color: #ed6555"
              >其中{{
                examination && examination.contractDisputesSize
                  ? examination.contractDisputesSize
                  : 0
              }}条涉及合同类型纠纷</text
            >
          </view>

          <view
            class="collapseCardTitle"
            v-if="
              currentBodyTabIndex === 1 &&
              personSubjectToExecution &&
              personSubjectToExecution.length > 0
            "
          >
            存在{{
              examination && examination.personSubjectToExecutionSize
                ? examination.personSubjectToExecutionSize
                : 0
            }}条被执行人信息
          </view>

          <view
            class="collapseCardTitle"
            v-if="
              currentBodyTabIndex === 2 &&
              administrativePenalties &&
              administrativePenalties.length > 0
            "
          >
            存在{{
              examination && examination.administrativePenaltiesSize
                ? examination.administrativePenaltiesSize
                : 0
            }}条行政处罚信息
          </view>

          <view
            class="cardItem"
            v-if="
              currentBodyTabIndex === 0 &&
              litigationInformation !== null &&
              litigationInformation.length > 0
            "
            v-for="item in litigationInformation"
            :key="item.id"
          >
            <view class="title itemRow">
              <view class="caseNmae" style="font-weight: 700"
                >{{ item.caseType }}案件</view
              >
              <view class="caseTime">{{ item.judgeDate }}</view>
            </view>
            <view class="itemRow">
              <text class="itemName">案号:</text>
              <text>{{ item.caseNo }}</text>
            </view>
            <view class="itemRow">
              <text class="itemName">案由:</text>
              <text>{{ item.caseReason }}</text>
            </view>
            <view class="itemRow">
              <text class="itemName">诉讼地位:</text>
              <text>{{ item.isProsecutor ? "原告" : "被告" }}</text>
            </view>
          </view>

          <view
            class="cardItem"
            v-else-if="
              currentBodyTabIndex === 1 &&
              personSubjectToExecution !== null &&
              personSubjectToExecution?.length > 0
            "
            v-for="item in personSubjectToExecution"
            :key="item.id"
          >
            <view class="title itemRow">
              <view class="caseNmae" style="font-weight: 700">{{
                item.suspectedApplicant
              }}</view>
              <view class="caseTime">{{ item.lianDate }}</view>
            </view>
            <view class="itemRow">
              <text class="itemName">案号:</text>
              <text>{{ item.anNo }}</text>
            </view>
            <view class="itemRow">
              <text class="itemName">执行标的:</text>
              <text>{{ item.biaodi }}</text>
            </view>
            <view class="itemRow">
              <text class="itemName">执行法院:</text>
              <text>{{ item.executeGov }}</text>
            </view>
          </view>

          <view
            class="cardItem"
            v-else-if="
              currentBodyTabIndex === 2 &&
              administrativePenalties !== null &&
              administrativePenalties.length > 0
            "
            v-for="item in administrativePenalties"
            :key="item.id"
          >
            <view class="title itemRow">
              <view class="caseNmae" style="font-weight: 700">{{
                item.docNo
              }}</view>
              <view class="caseTime">{{ item.punishDate }}</view>
            </view>
            <view class="itemRow">
              <text class="itemName">处罚事由:</text>
              <text>{{ item.punishReason }}</text>
            </view>
            <view class="itemRow">
              <text class="itemName">处罚内容:</text>
              <text>{{ item.punishResult }}</text>
            </view>
            <view class="itemRow">
              <text class="itemName">处罚单位:</text>
              <text>{{ item.punishOffice }}</text>
            </view>
            <view class="itemRow">
              <text class="itemName">处罚金额:</text>
              <text>{{ item.punishAmt }}</text>
            </view>
          </view>

          <view
            class="cardItem"
            v-else-if="
              (currentBodyTabIndex === 0 &&
                litigationInformation !== null &&
                litigationInformation.length === 0) ||
              (currentBodyTabIndex === 0 && litigationInformation === null)
            "
          >
            <view class="title itemRow">
              <view class="caseNmae" style="font-weight: 700">XXXXX案件</view>
              <view class="caseTime">2024-03-24</view>
            </view>
            <view class="itemRow">
              <text class="itemName">案号:</text>
              <text>XXXXXX</text>
            </view>
            <view class="itemRow">
              <text class="itemName">案由:</text>
              <text>XXXXXX纠纷</text>
            </view>
            <view class="itemRow">
              <text class="itemName">诉讼地位:</text>
              <text>XXXXXX</text>
            </view>
            <view class="example">示例</view>
          </view>

          <view
            class="cardItem"
            v-else-if="
              (currentBodyTabIndex === 1 &&
                personSubjectToExecution !== null &&
                personSubjectToExecution?.length === 0) ||
              (currentBodyTabIndex === 1 && personSubjectToExecution === null)
            "
          >
            <view class="title itemRow">
              <view class="caseNmae" style="font-weight: 700"
                >XXX疑似申请人</view
              >
              <view class="caseTime">2024-03-24</view>
            </view>
            <view class="itemRow">
              <text class="itemName">案号:</text>
              <text>XXXXXX</text>
            </view>
            <view class="itemRow">
              <text class="itemName">执行标的:</text>
              <text>XXXXXX</text>
            </view>
            <view class="itemRow">
              <text class="itemName">执行法院:</text>
              <text>XXXXXX法院</text>
            </view>
            <view class="example">示例</view>
          </view>

          <view
            class="cardItem"
            v-else-if="
              (currentBodyTabIndex === 2 &&
                administrativePenalties !== null &&
                administrativePenalties.length === 0) ||
              (currentBodyTabIndex === 2 && administrativePenalties === null)
            "
          >
            <view class="title itemRow">
              <view class="caseNmae" style="font-weight: 700">XXXX文书号</view>
              <view class="caseTime">2024-03-24</view>
            </view>
            <view class="itemRow">
              <text class="itemName">处罚事由:</text>
              <text>XXXXXX</text>
            </view>
            <view class="itemRow">
              <text class="itemName">处罚内容:</text>
              <text>XXXXXX</text>
            </view>
            <view class="itemRow">
              <text class="itemName">处罚单位:</text>
              <text>XXXXXX</text>
            </view>
            <view class="itemRow">
              <text class="itemName">处罚金额:</text>
              <text>XXXXXX</text>
            </view>
            <view class="example">示例</view>
          </view>
        </view>
      </view>

      <!-- 确认弹窗 -->
      <u-modal
        :show="showConfirmModal"
        showCancelButton
        @cancel="handleConfirmCancel"
        @confirm="handleConfirmConfirm"
      >
        <view class="slot-content" style="text-align: center">
          <view>
            <image
              style="width: 300rpx; height: 300rpx"
              src="https://cdn.law.xiaomugua.cn/minip/seal.png"
            ></image>
            <view style="font-weight: 700; font-size: 20px">提示</view>
            <view
              style="
                margin: 30rpx 0;
                font-size: 16px;
                text-align: left;
                color: #4c4c4c;
              "
              >将消耗1次主体审查次数, 确定进行主体审查?</view
            >
          </view>
        </view>
      </u-modal>
    </view>
  </view>

  <view class="btn" v-show="currentTabIndex == 0">
    <button
      style="background: #0571ff; color: #fff; margin: 0 20rpx"
      @tap="handleOk"
    >
      完成
    </button>
  </view>
  <!-- </watermarker> -->
  <u-popup :show="show" round="20" mode="bottom" @close="close" v-show="show">
    <view class="popup">
      <view class="estimated-delivery">
        <navigator
          :url="`/subpackage/previewWord/previewWord?conversationId=${conversationId}`"
          hover-class="none"
          class="border-box"
        >
          <image
            src="https://cdn.law.xiaomugua.cn/minip/reviewPng.png"
            mode=""
          ></image>
        </navigator>
        <text>预览</text>
      </view>

      <view class="estimated-delivery">
        <view class="border-box" @tap="handleCopyweb">
          <image
            src="https://cdn.law.xiaomugua.cn/minip/sharePng.png"
            mode=""
          ></image>
        </view>
        <text>发送至电脑</text>
      </view>
      <view class="estimated-delivery">
        <view class="border-box" @tap="handleCopy">
          <image
            src="https://cdn.law.xiaomugua.cn/minip/mark.png"
            mode=""
          ></image>
        </view>
        <text>下载标注版</text>
      </view>
      <view class="estimated-delivery">
        <view class="border-box" @tap="handleExportClean">
          <image
            src="https://cdn.law.xiaomugua.cn/minip/clear.png"
            mode=""
          ></image>
        </view>
        <text>下载清洁版</text>
      </view>
      <view class="estimated-delivery">
        <view class="border-box" @tap="handlePreservatio">
          <image src="https://cdn.law.xiaomugua.cn/minip/image.png"></image>
        </view>
        <text>保存图片</text>
      </view>
    </view>
    <!-- <button @tap="show = !show" class="popup-btn">取消</button> -->
    <view class="popCancel" @tap="show = !show">
      <view class="cancelBox">
        <image src="https://cdn.law.xiaomugua.cn/minip/cancel.png"></image>
      </view>
    </view>
  </u-popup>
  <u-overlay :show="qrCodeShow" @click="qrCodeShow = false">
    <view class="service">
      <view class="title">木瓜AI合同审核结果</view>
      <view class="qrCode">
        <u-qrcode
          :val="qrCodeUrl"
          :size="230"
          ref="qrcodeRef"
          :showLoading="false"
          @longtap="handleLong"
        />
      </view>

      <view class="tips">长按/点击保存将二维码保存到相册</view>
      <button class="save" @tap="handleQrcodeImg">保存</button>
    </view>
  </u-overlay>

  <u-overlay :show="Allow" v-show="Allow" @click="Allow = false">
    <view class="Allow">
      <image
        src="https://cdn.law.xiaomugua.cn/minip/saveImage.png"
        mode=""
      ></image>
      <view class="Allow-logo">
        <view class="title">木瓜合同宝审核结果</view>
      </view>
      <scroll-view class="box" scroll-y="true" id="box">
        <canvas
          :style="{ width: '100%', height: canvasH + 'px' }"
          canvas-id="myCanvas"
          id="myCanvas"
          @longpress.stop="shareImg"
        ></canvas>
        <view
          class="resols-box"
          id="Allow"
          ref="AllowList"
          v-if="imgFilePath == ''"
        >
          <view class="title">{{ fileName }}</view>
          <view class="result">审核结果（{{ num }}）</view>
          <view
            class="collapse"
            v-for="(item, index) in reviewDetail"
            :key="index"
          >
            <view class="result-title">
              {{ item.businessRisk }}
            </view>
            <view class="collapse-title">
              <view class="subtitle">解释说明</view>
              <view class="text">
                {{ item.details.proposedChanges }}
              </view>
            </view>
            <view class="collapse-title">
              <view class="title">
                <span style="background-color: #bcdcff">修改建议</span>
              </view>
              <view class="text">
                {{ item.details.modifiedContent }}
              </view>
            </view>
            <view class="collapse-title">
              <view class="subtitle">相关法规</view>
              <view class="text">
                {{ item.details.relatedRegulation }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <button class="Allow-btn" @tap="handleAllowPictrue">保存图片</button>
    </view>
  </u-overlay>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { onLoad, onShow, onHide, onShareAppMessage } from "@dcloudio/uni-app";
import {
  getContractById,
  getConversationFile,
  mainExamination,
  exportClean,
  getUserMainBodyCount,
} from "@/api/upload.js";
import { wxExport } from "@/api/operation.js";
import { getCurrentInstance } from "vue";
import QRCode from "../../uni_modules/uview-plus/components/u-qrcode/qrcode";
import toast from "@/libs/function/toast.js";

const fileName = ref("");
const AllowList = ref(null);
const instance = getCurrentInstance();
const reviewDetail = ref([]);
const num = ref(0);
const open = ref(false);
const mainOpen = ref(false);
const show = ref(false);
const linkUrl = ref("");
const canvasW = ref(0);
const canvasH = ref(8000);
// 窗口宽高
const windowWidth = ref(120);
const windowHeight = ref(90);
// 保存权限验证
const pictrueShow = ref(false);
// 保存图片按钮
const Allow = ref(false);
// 对话Id
const conversationId = ref("");
// 二维码
const qrCodeShow = ref(false);
// 二维码链接
const qrCodeUrl = ref("");
const viewerUrl = ref("");
const examination = ref();
const qrcodeRef = ref(null);
const tabList = ref([
  { name: `风险审查`, badge: { value: num.value } },
  { name: "主体审查" },
]);
const bodyList = ref([
  {
    name: `涉诉信息 ${
      (examination.value && examination.value.contractDisputesSize) || 0
    }`,
  },
  {
    name: `执行人信息 ${
      (examination.value && examination.value.personSubjectToExecutionSize) || 0
    }`,
  },
  {
    name: `行政处罚信息 ${
      (examination.value && examination.value.administrativePenaltiesSize) || 0
    }`,
  },
]);
const currentTabIndex = ref(0);
const currentBodyTabIndex = ref(0);
const pageLoading = ref(false);
const pickerShowMainBody = ref(false);
const companyNameList = ref([]);
const selectedMainBodyName = ref("暂无主体");
const litigationInformation = ref([]);
const personSubjectToExecution = ref([]);
const administrativePenalties = ref([]);
const bodyReviewCount = ref(0);
var imgFilePath = "";
const userId = ref("");
const toBodyReview = ref(false);
const showConfirmModal = ref(false);

const handleMainBodyConfirm = (val) => {
  console.log(val);
  selectedMainBodyName.value = val.value[0];
  pickerShowMainBody.value = false;
};

const handleConfirmCancel = () => {
  showConfirmModal.value = false;
  pageLoading.value = false;
};

const handleConfirmConfirm = async () => {
  toBodyReview.value = true;
  await handleMainBody();
  showConfirmModal.value = false;
};

const handleMainBody = () => {
  if (companyNameList.value.length > 0) {
    pageLoading.value = true;
    mainExamination(
      conversationId.value,
      selectedMainBodyName.value,
      toBodyReview.value
    )
      .then((res) => {
        console.log(327, res.code);
        if (res.code === 200) {
          console.log(res.code, "res.code");
          examination.value = {
            name: res.data.name,
            status: res.data.status,
            econKind: res.data.econKind,
            creditCode: res.data.creditCode,
            operName: res.data.operName,
            industry: res.data.industry,
            personScope: res.data.personScope,
            address: res.data.address,
            litigationInformationSize: res.data.litigationInformationSize,
            contractDisputesSize: res.data.contractDisputesSize,
            personSubjectToExecutionSize: res.data.personSubjectToExecutionSize,
            administrativePenaltiesSize: res.data.administrativePenaltiesSize,
          };
          litigationInformation.value = res.data.litigationInformationList;
          personSubjectToExecution.value =
            res.data.personSubjectToExecutionList;
          administrativePenalties.value = res.data.administrativePenaltiesList;
          bodyList.value = [
            {
              name: `涉诉信息 ${
                (examination.value &&
                  examination.value.litigationInformationSize) ||
                0
              }`,
            },
            {
              name: `执行人信息 ${
                (examination.value &&
                  examination.value.personSubjectToExecutionSize) ||
                0
              }`,
            },
            {
              name: `行政处罚信息 ${
                (examination.value &&
                  examination.value.administrativePenaltiesSize) ||
                0
              }`,
            },
          ];
          pageLoading.value = false;
          getMainBodyCount(userId.value);
        } else if (res.code === 25003) {
          console.log("提示弹窗");
          pageLoading.value = false;
          showConfirmModal.value = true;
        } else {
          console.log(res.code, "360code");
          uni.showToast({
            title: res.message,
            icon: "none",
          });
          pageLoading.value = false;
        }
      })
      .catch((err) => {
        console.log(err, "err");
        if (err.code === 25003) {
          showConfirmModal.value = true;
        } else {
          pageLoading.value = false;
          uni.showToast({
            title: err.message,
            icon: "none",
          });
        }
      });
  } else {
    uni.showToast({
      title: "暂未在合同中查询到企业或公司",
      icon: "none",
    });
  }
};

const handlePickerCancel = () => {
  pickerShowMainBody.value = false;
};

const handleGoBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const handleTab = (item, index) => {
  console.log(companyNameList.value, "companyNameList");
  if (index === 1) {
    if (companyNameList.value && companyNameList.value.length > 0) {
      selectedMainBodyName.value = companyNameList.value[0];
      currentTabIndex.value = index;
    } else {
      toast("暂未在合同中查询到企业或公司");
    }
  } else {
    currentTabIndex.value = index;
  }
};

const handleBodyTab = (item, index) => {
  currentBodyTabIndex.value = index;
};

// onShareAppMessage((res) => {
// 	return {
// 		path: '/pages/index/index',
// 		title: '木瓜合同宝',
// 		imageUrl: 'https://cdn.law.xiaomugua.cn/minip/mugua-ai.png',
// 		success(res) {
// 			console.log(res);
// 		},
// 		fail(err) {
// 			console.log(err);
// 		}
// 	};
// });

// 判断是否有保存图片权限
const handlePreservatio = () => {
  uni.getSetting({
    success: (res) => {
      // console.log(res.authSetting['scope.writePhotosAlbum']);
      if (!res.authSetting["scope.writePhotosAlbum"]) {
        console.log("开启权限");
        uni.authorize({
          scope: "scope.writePhotosAlbum",
          success: (res) => {
            console.log(res, "sucess");
            show.value = false;
            if (res.errMsg === "authorize:ok") {
              Allow.value = !Allow.value;
              handleCaves();
            } else {
              Allow.value = !Allow.value;
            }
          },
          fail: (err) => {
            console.log(err, "err");
            if (err.errMsg === "authorize:fail auth deny") {
              console.log("authorize:fail auth deny");
              wx.showModal({
                title: "提示",
                content: "检测到您没打开获取信息功能权限，是否去设置打开？",
                success(res) {
                  if (res.confirm) {
                    console.log("用户点击确定");
                    wx.openSetting({
                      success: (res) => {
                        console.log(res);
                      },
                    });
                  } else if (res.cancel) {
                    console.log("用户点击取消");
                  }
                },
              });
            }
          },
        });
      } else {
        show.value = false;
        Allow.value = !Allow.value;
        console.log(res.authSetting["scope.writePhotosAlbum"], "有权限");
      }
    },
    fail: (err) => {
      console.log(err);
    },
  });
};

// 生成图片
const drawImg = () => {
  // console.log(num.value);
  let details = [];
  let text;
  let spaces = " ".repeat(20);
  details.push(`${spaces}${fileName.value}\n\n审核结果(${num.value})\n\n`);
  reviewDetail.value.forEach((item) => {
    return details.push(
      item.businessRisk +
        "\n\n" +
        "批注内容\n" +
        item.details.proposedChanges +
        "\n\n" +
        "修改意见\n" +
        item.details.modifiedContent +
        "\n\n" +
        "相关法规\n" +
        item.details.relatedRegulation +
        "\n\n"
    );
    // details.push()
  });
  text = details.join("");
  // console.log(text, 'text');
  const query = uni.createSelectorQuery().in(instance.proxy);
  query
    .select("#myCanvas") // 可以选取容器或 canvas 自己
    .boundingClientRect();
  query.exec((rect) => {
    canvasW.value = rect[0].width;
    canvasH.value = rect[0].height;
    // canvasW.value = 308;
    // canvasH.value = 8000;
    console.log(canvasW.value, canvasH.value);
    setTimeout(() => {
      const ctx = uni.createCanvasContext("myCanvas");
      var lineHeight = 20; // 这是每行的高度
      var x = 10;
      var y = 30;
      // 设置背景色
      ctx.setFillStyle("#ffffff");
      ctx.fillRect(0, 0, canvasW.value, canvasH.value);

      // 手动绘制文本
      ctx.setFontSize(16);
      // ctx.font = "16px serif";
      ctx.setFillStyle("#000000"); // 设置文本颜色
      // ctx.fillText("1111", 10, 30); // 确保文本在画布内
      // console.log(details);
      // text.split('\n').forEach((line) => {
      // 	ctx.fillText(line, x, y);
      // 	y += lineHeight;
      // });

      const fontSizeTitle1 = 20;
      const fontSizeTitle2 = 18;
      const fontSizeTitle3 = 16;
      const fontSizeText = 14;
      const textLineHeight = 24;
      let currentY = 30;

      // 换行
      function wrapText(text, fontSize, maxWidth) {
        ctx.font = fontSize + "px Arial";
        const words = text.split("");
        let line = "";
        const lines = [];

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + "";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + "";
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        return lines;
      }

      let isFirstTitle = 2;
      function drawText(text, fontSize, isBold, x, y, maxWidth) {
        const lines = wrapText(text, fontSize, maxWidth);
        if (isFirstTitle !== 0) {
          if (isFirstTitle == 2) {
            ctx.save();
            ctx.textAlign = "center";
            ctx.font = (isBold ? "bold " : "") + fontSizeTitle1 + "px Arial";
            x = maxWidth / 2 + 10;
          }
          if (isFirstTitle == 1) {
            ctx.save();
            ctx.textAlign = "start";
            ctx.font = "bold " + fontSizeTitle2 + "px Arial";
          }
          isFirstTitle--;
        } else {
          ctx.save();
          ctx.textAlign = "start";
          ctx.font = (isBold ? "bold " : "") + fontSize + "px Arial";
        }

        lines.forEach((line) => {
          ctx.fillText(line, x, y);
          ctx.restore();
          y += textLineHeight;
        });

        if (isFirstTitle == 1) {
          y += textLineHeight;
        }
        return y;
      }

      //水印
      function addRotatedWatermark(text, angle) {
        const watermarkText = text;
        const fontSize = 20;
        const _angle = (45 * Math.PI) / 180;
        const opacity = 0.5;

        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = `rgba(150, 150, 150, ${opacity})`;
        // ctx.textAlign = 'center';
        ctx.textBaseline = "middle";

        // 计算水印间隔
        const margin = 200;
        const stepX = fontSize * Math.cos(_angle) + margin;
        const stepY = fontSize * Math.sin(_angle) + margin;

        // 绘制水印
        ctx.save();
        for (let x = 0; x < canvasW.value; x += stepX) {
          for (let y = 0; y < canvasH.value; y += stepY) {
            ctx.save();
            ctx.translate(x, y); // 移动到当前位置
            ctx.rotate(_angle); // 旋转 45 度
            ctx.fillText(watermarkText, 0, 0); // 绘制水印文本
            ctx.restore();
          }
        }
        ctx.restore();
      }

      details.forEach((item) => {
        const parts = item.split("\n\n");
        if (parts.length > 1) {
          // 标题
          const title = parts[0].trim();
          const rest = parts.slice(1).join("\n\n").trim();

          if (title) {
            currentY = drawText(
              title,
              fontSizeTitle2,
              true,
              10,
              currentY,
              canvasW.value - 10
            );
          }

          // 内容
          const lines = rest.split("\n");
          lines.forEach((line) => {
            if (line.startsWith("批注内容")) {
              currentY = drawText(
                "解释说明",
                fontSizeTitle3,
                true,
                10,
                currentY,
                canvasW.value - 10
              );
            } else if (line.startsWith("修改意见")) {
              currentY = drawText(
                line,
                fontSizeTitle3,
                true,
                10,
                currentY,
                canvasW.value - 10
              );
            } else if (line.startsWith("相关法规")) {
              currentY = drawText(
                line,
                fontSizeTitle3,
                true,
                10,
                currentY,
                canvasW.value - 10
              );
            } else {
              currentY = drawText(
                line,
                fontSizeText,
                false,
                10,
                currentY,
                canvasW.value - 10
              );
            }
          });

          currentY += textLineHeight; // Extra space after each section
        }
      });

      addRotatedWatermark("此结果由木瓜AI合同宝审核生成", 45);

      ctx.draw(
        false,
        () => {
          // console.log(ctx, 'ctx');
          // canvas 画布生成图片
          uni.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: canvasW.value,
            height: currentY,
            destWidth: canvasW.value,
            destHeight: currentY,
            canvasId: "myCanvas",
            success: function (res) {
              console.log(res.tempFilePath, "tempFilePath");
              imgFilePath = res.tempFilePath;
              console.log(imgFilePath, "imgFilePath");
            },
            fail: function (error) {
              console.error(error, "error");
              if (
                error.errMsg ===
                "canvasToTempFilePath:fail :create bitmap failed"
              ) {
                uni.toast({
                  title: "图片生成失败，请稍后重试",
                  icon: "none",
                  duration: 2000,
                });
              }
            },
            complete: () => {
              console.log(canvasW.value);
              console.log(currentY, "currentY");
              canvasH.value = currentY;
            },
          });
        },
        500
      );
    });
    // 现在你可以使用动态设置的宽高绘制内容
  });
};

// 保存图片在本地
const handleCaves = () => {
  console.log(imgFilePath);
  uni.saveImageToPhotosAlbum({
    filePath: imgFilePath,
    success: function (album) {
      console.log(album);
      wx.showToast({
        title: "保存成功",
        icon: "success",
        duration: 2000,
      });
    },
    fail: function (err) {
      console.error(err);
    },
    // complete: () => {
    // 	canvasW.value = 0;
    // 	canvasH.value = 0;
    // }
  });
};

const handleAllowPictrue = () => {
  Allow.value = false;
  handleCaves();
};

// 发送到电脑
const handleCopyweb = () => {
  uni.setClipboardData({
    data: linkUrl.value,
    showToast: false,
    success: (res) => {
      if (res.errMsg === "setClipboardData:ok") {
        show.value = false;
      }
    },
    fail: (err) => {},
  });
};
// 下载清洁版`
const handleExportClean = () => {
  exportClean(conversationId.value)
    .then((response) => {
      console.log(response);
      uni.setClipboardData({
        data: response.data,
        showToast: false,
        success: (res) => {
          if (res.errMsg === "setClipboardData:ok") {
            uni.showToast({
              title: "已复制下载连接",
              icon: "none",
            });
            show.value = false;
          }
        },
      });
    })
    .catch((err) => {
      console.log(err);
      uni.showToast({
        title: "网络异常,请稍后重试",
        icon: "none",
      });
    });
};
// 复制链接
const handleCopy = () => {
  uni.setClipboardData({
    data: linkUrl.value,
    success: (res) => {
      if (res.errMsg === "setClipboardData:ok") {
        uni.showToast({
          title: "已复制下载连接",
          icon: "none",
        });
        show.value = false;
      }
    },
    fail: (err) => {
      console.log(err);
    },
  });
};

//二维码显示
const handleQrcode = () => {
  show.value = false;
  qrCodeShow.value = !qrCodeShow.value;
};
// 长按保存二维码
const handleLong = () => {
  uni.showModal({
    content: "是否确认保存图片",
    success: (res) => {
      if (res.confirm) {
        handleQrcodeImg();
        qrCodeShow.value = false;
      }
    },
    fail: (err) => {
      console.log(err);
    },
  });
};
// 保存二维码为图片
const handleQrcodeImg = () => {
  // console.log(img,"img");

  // console.log();
  wx.getSetting({
    success(res) {
      if (!res.authSetting["scope.writePhotosAlbum"]) {
        wx.authorize({
          scope: "scope.writePhotosAlbum",
          success: (result) => {
            console.log(result, "result");
            if (res.errMsg === "authorize:ok") {
              qrcodeRef.value._saveCode();
            }
          },
          fail: (err) => {
            // 用户拒绝授权
            if (err.errMsg === "authorize:fail auth deny") {
              console.log("authorize:fail auth deny");
              wx.showModal({
                title: "提示",
                content: "检测到您没打开获取信息功能权限，是否去设置打开？",
                success(res) {
                  if (res.confirm) {
                    console.log("用户点击确定");
                    wx.openSetting({
                      success: (res) => {
                        console.log(res);
                      },
                    });
                  } else if (res.cancel) {
                    console.log("用户点击取消");
                  }
                },
              });
            }
          },
          complete: () => {
            qrCodeShow.value = !qrCodeShow.value;
          },
        });
      } else {
        // qrCodeShow.value = !qrCodeShow.value;
        qrcodeRef.value._saveCode();
      }
    },
  });
};
// 关闭
const close = () => {
  if (show.value) {
    show.value = false;
  } else {
    pictrueShow.value = false;
  }
};
// 获取页面宽度和高度
const getSystemInfo = () => {
  uni.getSystemInfo({
    success: function (res) {
      windowWidth.value = res.windowWidth;
      windowHeight.value = res.windowHeight;
      // console.log('屏幕宽度:', screenWidth);
      // console.log('屏幕高度:', screenHeight);
      // console.log('窗口宽度:', windowWidth.value);
      // console.log('窗口高度:', windowHeight.value);
    },
  });
};
onHide(() => {
  show.value = false;
  Allow.value = false;
  qrCodeShow.value = false;
});

onLoad(async (e) => {
  getSystemInfo();
  conversationId.value = e.conversationId;
  if (e.reviewDetail) {
    reviewDetail.value = JSON.parse(decodeURIComponent(e.reviewDetail));
    num.value = JSON.parse(decodeURIComponent(e.reviewDetail)).length;
    tabList.value = [
      {
        name: `风险审查`,
        badge: { value: JSON.parse(decodeURIComponent(e.reviewDetail)).length },
      },
      { name: "主体审查" },
    ];
    companyNameList.value = e.companyName.split(",");
  } else {
    // 获取合同信息
    await getContractById(e.conversationId)
      .then((res) => {
        console.log(res, "res.data.companyNameList");
        reviewDetail.value = res.data.contractReviewHistoryRecord.reviewDetail;
        num.value = res.data.contractReviewHistoryRecord.reviewDetail.length;
        tabList.value = [
          {
            name: `风险审查`,
            badge: {
              value: res.data.contractReviewHistoryRecord.reviewDetail.length,
            },
          },
          { name: "主体审查" },
        ];
        companyNameList.value =
          res.data.contractReviewHistoryRecord.companyNameList;
        if (res.data.bodyReview && res.data.bodyReview.length > 0) {
          examination.value = {
            name: res.data.bodyReview[0].name,
            status: res.data.bodyReview[0].status,
            econKind: res.data.bodyReview[0].econKind,
            creditCode: res.data.bodyReview[0].creditCode,
            operName: res.data.bodyReview[0].operName,
            industry: res.data.bodyReview[0].industry,
            personScope: res.data.bodyReview[0].personScope,
            address: res.data.bodyReview[0].address,
            litigationInformationSize:
              res.data.bodyReview[0].litigationInformationSize,
            contractDisputesSize: res.data.bodyReview[0].contractDisputesSize,
            personSubjectToExecutionSize:
              res.data.bodyReview[0].personSubjectToExecutionSize,
            administrativePenaltiesSize:
              res.data.bodyReview[0].administrativePenaltiesSize,
          };
          bodyList.value = [
            {
              name: `涉诉信息 ${
                (examination.value &&
                  examination.value.litigationInformationSize) ||
                0
              }`,
            },
            {
              name: `执行人信息 ${
                (examination.value &&
                  examination.value.personSubjectToExecutionSize) ||
                0
              }`,
            },
            {
              name: `行政处罚信息 ${
                (examination.value &&
                  examination.value.administrativePenaltiesSize) ||
                0
              }`,
            },
          ];
          litigationInformation.value =
            res.data.bodyReview[0].litigationInformationList;
          personSubjectToExecution.value =
            res.data.bodyReview[0].personSubjectToExecutionList;
          administrativePenalties.value =
            res.data.bodyReview[0].administrativePenaltiesList;
          selectedMainBodyName.value = res.data.bodyReview[0].name;
        }
      })
      .catch((err) => {
        console.log(err, "err 789");
      });
  }
  await getConversationFile(e.conversationId)
    .then((res) => {
      console.log(res, "getConversationFile");
      if (res.code === 200) {
        fileName.value = res.data[0].fileName.split(".").shift();
      } else {
        uni.showToast({
          title: res.message,
          icon: "error",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  await wxExport(e.conversationId).then((res) => {
    if (res.code === 200) {
      let viewerUrl = null;
      qrCodeUrl.value = res.data;

      console.log(qrCodeUrl.value, "qrCodeUrl");
      viewerUrl = res.data;
      // linkUrl.value = `https://view.officeapps.live.com/op/view.aspx?src=${viewerUrl}`;
      linkUrl.value = viewerUrl;
    }
  });
  const id = uni.getStorageSync("userId") || uni.getStorageSync("wxuserId");
  userId.value = id;
  if (id) {
    getMainBodyCount(id);
  }
});

const getMainBodyCount = async (userId) => {
  await getUserMainBodyCount(userId)
    .then((res) => {
      bodyReviewCount.value = res.data.combination.bodyReviewCount;
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleOk = function () {
  show.value = true;
};

// onMounted(async() => {
// 	await setTimeout(()=>drawImg(),500)
// });

onShareAppMessage(() => {
  uni.$u.mpShare.value = {
    title: "木瓜AI合同审核结果",
    imageUrl: imgFilePath,
  };
});
watch(
  Allow,
  () => {
    setTimeout(() => {
      drawImg();
    }, 100);
  },
  { once: true }
);

const shareImg = () => {
  console.log(1);
  wx.showShareImageMenu({
    path: imgFilePath,
    needShowEntrance: true,
  });
};
</script>

<style lang="scss" scoped>
.service {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  background: #ffffffff;
  margin: 25% 40rpx;
  padding: 64rpx 0;
  .save {
    margin-top: 56rpx;
    width: 430rpx;
    // height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 8rpx;
    color: #ffffffff;
    background: linear-gradient(106.65deg, #4683ff 0%, #1864fe 100%);
  }
  .title {
    font-size: 48rpx;
    font-weight: 600;
    color: rgba(20, 20, 20, 1);
  }
  .qrCode {
    margin-top: 60rpx;
    width: 460rpx;
    height: 460rpx;
    // background: #eee;
  }

  // image {
  // 	width: 460rpx;
  // 	height: 460rpx;
  // }

  .tips {
    margin-top: 30rpx;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.45);
  }
}

.resols-box {
  padding: 28rpx 36rpx;
  background: #ffffff;

  .title {
    font-size: 40rpx;
    font-weight: 700;
    text-align: center;
  }

  .result {
    font-size: 36rpx;
    font-weight: 500;
  }

  .collapse {
    padding: 0 30rpx;
    .result-title {
      margin-top: 36rpx;
      font-size: 32rpx;
      font-weight: 600;
    }

    .subtitle {
      margin-top: 26rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .text {
      padding-top: 10rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
}
.Allow {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  background: #ffffffff;
  margin: 10% 40rpx;
  padding: 64rpx 0;
  background: linear-gradient(to bottom, #f0f3ff, #fefefe);
  position: relative;
  top: 50%;
  transform: translateY(-65%);
  padding-top: 100rpx;

  image {
    width: 260rpx;
    height: 150rpx;
    position: absolute;
    top: -100rpx;
    z-index: 1;
  }
  .Allow-logo {
    display: flex;

    .title {
      font-size: 40rpx;
      color: rgba(20, 20, 20, 1);
    }
  }

  .box {
    margin-top: 30rpx;
    width: 616rpx;
    height: 550rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    // overflow: hidden;
  }
}
.Allow-btn {
  width: 430rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  color: #ffffffff;
  border-radius: 40rpx;
  background: #f0f3ff;
  color: #4d6ef1;
  margin-top: 50rpx;
}
.Allow-btn::after {
  border: none;
}
.Image-permission {
  padding: 48rpx 54rpx;

  .logo {
    display: flex;
    align-items: center;

    image {
      width: 48rpx;
      height: 48rpx;
      margin-right: 10rpx;
    }

    .logo-title {
      font-size: 28rpx;
      font-weight: 700;
      margin-right: 10rpx;
    }

    .logo-apply {
      font-size: 24rpx;
      color: rgba(0, 0, 0, 0.8);
    }
  }

  .picture-apply {
    padding-top: 40rpx;
    font-size: 32rpx;
    font-weight: 600;
  }

  .subpicture-apply {
    font-size: 28rpx;
    padding-top: 16rpx;
    color: rgba(0, 0, 0, 0.65);
  }

  .footer-btn {
    padding-top: 48rpx;
    display: flex;
    justify-content: space-around;

    .footer-left {
      width: 242rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 4px;
      font-size: 32rpx;
      color: rgba(0, 0, 0, 0.65);
      border: 1px solid rgba(0, 0, 0, 0.65);
    }

    .footer-right {
      width: 242rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 4px;
      font-size: 32rpx;
      background: linear-gradient(106.65deg, #4683ff 0%, #1864fe 100%);
      color: #fff;
    }
  }
}

.popCancel {
  display: flex;
  justify-content: center;
  .cancelBox {
    width: 240rpx;
    height: 80rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}

.popup {
  padding: 40rpx 32rpx;
  display: flex;
  flex-wrap: wrap;
  padding-top: 70rpx;

  .popup-btn {
    border: 2rpx solid #000;
    margin: 32rpx;
  }

  .estimated-delivery {
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20rpx;

    .border-box {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 120rpx;
      border-radius: 24rpx;
      margin-bottom: 15rpx;

      image {
        width: 44rpx;
        height: 44rpx;
      }
    }

    text {
      display: block;
      padding-top: 10rpx;
      font-size: 24rpx;
    }
  }
}

.contianer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 120rpx;
  background-color: rgba(249, 250, 254, 1);
  box-sizing: border-box;
  height: 100vh;
  .topBg {
    height: 180rpx;
    width: 100%;
    padding-top: 110rpx;
    position: absolute;
    pointer-events: none;
    .bgImg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .result {
    display: flex;
    align-items: center;
    font-size: 36rpx;
    font-weight: 600;
    color: rgba(20, 20, 20, 1);
    margin-bottom: 15rpx;
    padding: 0 30rpx;
  }

  .collapse {
    margin: 20rpx 0;
    border-radius: 8px 8px, 0px, 0px;
    background: #ffffff;
    box-shadow: 0px 2px 4px #eee;
    font-size: 32rpx;
    font-weight: 700;
    // height: 120vh;
    padding: 0 30rpx;

    .collapse-title {
      padding: 30rpx 0;
      word-wrap: break-word;
      max-width: 600rpx;
    }

    .collapse-subtitle {
      padding: 12rpx 0;
      z-index: -10;

      .title {
        font-size: 28rpx;
        color: #4d6ef1;
        font-weight: normal;
      }

      .text {
        padding-top: 10rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #232323;
      }
    }
  }
}

.btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120rpx;
  background-color: #fff;
}

:deep(.uni-collapse-item__title-text) {
  font-size: 32rpx;
  font-weight: 700;
  overflow: none;
  text-overflow: none;
}

:deep(.uni-collapse-item__wrap) {
  background: transparent;
}

.card {
  display: flex;
  margin: 16rpx 0;
  padding: 16rpx 30rpx;
  border-bottom: 1px solid #dddddd;
  .cardHeard {
    margin-left: 20rpx;
    flex: 1;
    .cardName {
      margin-bottom: 15rpx;
      font-size: 36rpx;
    }
    .cardCode {
      font-size: 28rpx;
      color: #7c7c7c;
    }
  }
}

.content {
  margin-bottom: 16rpx;
}

.details {
  margin-top: 16rpx;
}

.actions {
  display: flex;
  justify-content: space-between;
  padding-top: 16rpx;
  border-top: 1rpx solid #eee;
}
.collapseCardTitle {
  padding: 24rpx;
  font-size: 24rpx;
  font-weight: 600;
}
.collapseBox {
  margin-top: 20rpx;
}
.reviewBtn {
  width: 150rpx;
  height: 60rpx;
  line-height: 50rpx;
  background-color: rgba(169, 183, 238, 0.2);
  border-radius: 10rpx;
  color: #4d6ef1;
  padding: 8rpx;
  font-size: 26rpx;
  border: none;
}
.reviewBtn::after {
  border: none;
}
.kindTips {
  font-size: 20rpx;
  color: #ed6555;
  margin: 15rpx 0;
  padding: 0 30rpx;
}
.bodyInfo {
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20rpx;
  .infoItem {
    text-align: center;
    .itemTitle {
      color: #767676;
      margin-bottom: 15rpx;
    }
    .itemText {
      color: #252525;
      font-weight: 700;
      font-size: 32rpx;
    }
  }
}
.addressBox {
  margin: 0 30rpx;
  background-color: #f7f7f7;
  padding: 15rpx 20rpx;
  color: #2c2c2c;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  image {
    width: 28rpx;
    height: 34rpx;
    margin-right: 10rpx;
  }
}
.cardBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 30rpx 0 30rpx;
  overflow: hidden;
  overflow-y: auto;
  .cardItem {
    background-color: #f4f4f4;
    border-radius: 20rpx;
    width: 90%;
    padding: 10rpx 30rpx;
    position: relative;
    margin-bottom: 20rpx;
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10rpx;
      .caseName {
        font-size: 34rpx;
        font-weight: 700;
      }
      .caseTime {
        color: #999999;
      }
    }
    .itemRow {
      padding: 10rpx 0;
      .itemName {
        color: #999999;
        margin-right: 15rpx;
      }
    }
    .example {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 80rpx;
      font-weight: 700;
      background-color: #717171;
      color: #fff;
      text-align: center;
      padding: 10rpx;
      border-radius: 15rpx;
    }
  }
}
:deep(.u-tag--info--plain.data-v-2fd891bb) {
  padding: 8rpx;
}
:deep(.u-tag--success--plain.data-v-2fd891bb) {
  padding: 8rpx;
}
:deep(.u-tabs__wrapper__nav__item__text.data-v-02b0c54f) {
  font-size: 32rpx;
}
:deep(.uni-collapse-item__wrap-content.open) {
  border-bottom-width: 0;
}
:deep(.uni-collapse-item__title.uni-collapse-item-border) {
  border-bottom: none;
}
:deep(.u-text__value.data-v-0a574502) {
  text-align: center;
}
:deep(.u-tag--medium.data-v-2fd891bb) {
  height: auto;
}
:deep(.u-tabs__wrapper__nav__line.data-v-02b0c54f) {
  bottom: 0;
}
:deep(.u-text__value.data-v-5412c3d1) {
  text-align: center;
}
:deep(.u-tabs__wrapper__nav__item__text.data-v-ace3383c) {
  font-size: 36rpx;
}
:deep(.u-tag.data-v-02cb0dad.u-square.u-success--plain.u-medium) {
  padding: 10rpx;
}
:deep(.u-tag.data-v-02cb0dad.u-square.u-info--plain.u-medium) {
  padding: 10rpx;
}
</style>
