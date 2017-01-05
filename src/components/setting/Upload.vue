<template>
    <div class="custom-upload">
        <transition name="fade">
            <div class="upload-progress" :style="progressStyle" v-show="progress>0"></div>
        </transition>
        <div class="upload-tip">
            <p class="help">在以下区域输入课程内容或直接将复制的内容右键粘贴（Ctrl+V）到该区域</p>
            <label :for="running?'':'upload'" class="btn-link" :class="{disabled:running}">导入文档
                <input type="file" ref="uploadFile" id="upload" accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain">
            </label>
        </div>
        <div class="upload-content">
            <textarea class="art-content":class={error:isInvalid} v-model="contentString" placeholder="输入文本内容应少于10000字"></textarea>
        </div>
        <div class="upload-footer">
            <label class="label-group">文本目录：<span class="art-nav">{{navName}}</span></label>
            <label class="label-group">文本名称：<input class="art-tit" :class={error:isInvalid} type="text" v-model="title" placeholder="文章标题最多可输入50个字符"></label>
            <label class="label-group">
                <a href="javascript:;" class="nd-circle-btn art-save" :class="{disabled:isDisabled||isInvalid}" @click="saveArticle">保存</a>
            </label>
        </div>
    </div>
</template>
<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import {
    encodeHtml
} from '../../utils';
export default {
    name: 'Upload',
    data() {
        return {
            contentString: '',
            title: '',
            progress: 0,
            running: false
        }
    },
    computed: {
        ...mapGetters(['modeName', 'catalogName', 'typingCid']),
        navName() {
            return this.modeName + '—' + this.catalogName
        },
        progressStyle() {
            return {
                width: `${this.
                progress}%`
            }
        },
        isDisabled() {
            return this.title === '' || this.contentString === '';
        },
        isInvalid() {
            return this.title.length > 50 || this.contentString.length > 10000;
        }
    },
    methods: {
        ...mapActions(['create_article']),
        fileChange(e) {
            let files = e.target.files;
            if (files && files[0]) {
                let file = files[0];
                if (!/(.docx?|.txt)$/.test(file.name)) {
                    this.$message.error('请上传word、txt格式的文件!');
                    return;
                }
                let formData = new FormData();
                formData.append('articleFile', file);
                this.XHR.open('POST', `/${window.project_code}/v1/articles/upload`);
                this.XHR.send(formData);
            }
        },
        uploadProgress(e) {
            this.progress = e.loaded / e.total * 100 + 20;
        },
        uploadFinish(e) {
            let responseJSON = JSON.parse(this.XHR.response);
            this.title = responseJSON.title;
            this.contentString = responseJSON.content;
            this.uploadReset();
            // this.$message('导入成功');
            // this.$message.success('添加成功');
        },
        uploadError(e) {
            this.uploadReset();
        },
        uploadStart(e) {
            this.running = true;
        },
        uploadReset() {
            this.$refs.uploadFile.value = '';
            this.running = false;
            setTimeout(() => {
                this.progress = 0;
            }, 500);
        },
        saveArticle() {
            const article = {
                classify_id: this.typingCid,
                title: this.title,
                is_default: 1,
                content: this.contentString
            };
            this.create_article(article).then(response => {
                this.contentString = '';
                this.title = '';
                this.$emit('nd-modal-close');
            });
        }
    },
    mounted() {
        this.$refs.uploadFile.addEventListener('change', this.fileChange, false);
        this.XHR = new XMLHttpRequest();
        this.XHR.upload.addEventListener('progress', this.uploadProgress, false);
        this.XHR.addEventListener('load', this.uploadFinish, false);
        this.XHR.addEventListener('error', this.uploadError, false);
        this.XHR.addEventListener('loadstart', this.uploadStart, false);
    },
    beforeDestory() {
        this.$refs.uploadFile.removeEventListener('change', this.fileChange);
        this.XHR.upload.removeEventListener('progress', this.uploadProgress);
        this.XHR.removeEventListener('load', this.uploadFinish);
        this.XHR.removeEventListener('error', this.uploadError);
        this.XHR.removeEventListener('loadstart', this.uploadStart);
        this.XHR = null;
    }
}
</script>
<style lang="scss">
@import "../../scss/color";
@import "../../scss/transition";
.custom-upload {
    position: relative;

    width: 630px;
    height: 370px;

    color: #8a9199;
    .upload-progress {
        position: absolute;
        top: -10px;
        left: -20px;

        height: 3px;

        background-color: darken($themeColor,20%);

        transition: width .3s ease;
    }
    .upload-tip {
        position: relative;

        margin-bottom: 10px;
    }
    .btn-link {
        position: absolute;
        top: 0;
        right: 0;

        width: 80px;

        text-align: right;

        color: $themeColor;

        transition: color .3s ease;

        cursor: pointer;
        &:hover {
            color: darken($themeColor,8%);
        }
        input[type="file"] {
            visibility: hidden;

            width: 0;
            height: 0;
        }
        &.disabled {
            color: #eee;

            cursor: default;
            &:hover {
                color: #eee;
            }
        }
    }
    .upload-content {
        margin-bottom: 14px;
        border: 1px solid #e9e9e9;
        padding: 10px;
        .art-content {
            display: block;
            overflow: hidden;
            overflow-y: auto;

            border: none;
            width: 100%;
            height: 260px;

            color: #2e3033;

            outline: none;

            resize: none;
        }
    }
    .upload-footer {
        .label-group {
            margin-right: 25px;
        }
        .art-tit {
            padding: 6px 3px;
            width: 200px;
            height: 30px;
        }
        .art-save {
            float: right;

            margin: 0;
            width: 100px;
        }
    }
}
</style>
