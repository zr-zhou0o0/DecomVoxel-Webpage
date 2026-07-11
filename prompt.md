帮我写一个网页，我想做那种很炫酷的效果，比如 https://microsoft.github.io/TRELLIS/ 这种或者 https://vision-language-kinematics.github.io/ 这种效果，先告诉我你可以读到或者拉取到他们的模板吗？如果可以就照着写。主要是写一个论文的网页，论文的主要思路可以参考 /home/njunfeng/project-zirui/DecomVoxel/README.md ，论文目录/figures/里面的图片你可以引用。

python3 -m http.server 8001


youtube video link:
https://youtu.be/xcu_eHmrXes

（第一页的背景图用 figures/figure1.png 代替）

section:

1. 补充 author 信息：（注意 zhouzirui 是 共一，和 junfengni 都要标注星号；yixinchen 标注 project lead 的dagger符号，然后在下面注明 project lead）

Author Information
Author 1:
Name: Junfeng Ni
Email: njf23@mails.tsinghua.edu.cn
Company/Institution: Tsinghua University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 2:
Name: Zirui Zhou
Email: 2033616887@qq.com
Company/Institution: Tsinghua University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 3:
Name: Yixin Chen
Email: ethanchen@g.ucla.edu
Company/Institution: Beijing Institute for General Artificial Intelligence
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? Yes
Personal URL:

Author 4:
Name: Yu Liu
Email: liuyu_ai@foxmail.com
Company/Institution: Tsinghua University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 5:
Name: Nan Jiang
Email: nan.jiang@stu.pku.edu.cn
Company/Institution: Peking University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 6:
Name: Zhifei Yang
Email: zhifei.yeung@gmail.com
Company/Institution: Peking University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 7:
Name: Songchun Zhu
Email: s.c.zhu@pku.edu.cn
Company/Institution: Peking University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 8:
Name: Siyuan Huang
Email: huangsiyuan@ucla.edu
Company/Institution: Beijing Institute for General Artificial Intelligence
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:


2. code link 改成 active: https://github.com/zr-zhou0o0/DecomVoxel
3. dataset link 改成 active：https://huggingface.co/datasets/zr-zhou/Replica
4. 第一页 “Decom”的字体宽度稍微减少一点；“Voxel”字体不用改动。
5. 网页左上角的 logo 用这个图片 figures/logo.png
6. 主视觉采用 color.py 里面的 green 和 peach 双色配置。
7. 第二页的环节叫做“Intro”而不是“abstract”。

8. 第二页的 Intro 把原来的描述删掉，改成现在的：
We propose DecomVoxel, a framework that integrates guided 3D-native priors to enhance decompositional scene reconstruction. By formulating
object completion as guided in-situ optimization, our method achieves high-quality topology, geometry, and appearance for both individual objects and
backgrounds while strictly preserving original spatial layouts.

9. Intro 里面的 teaser 图片换成这个视频：https://youtu.be/xcu_eHmrXes，视频框的style可以参考 https://robosnap.github.io/，注意使用我们的主色系，可以用渐变色

10. 并且 Intro 除了现在的第 1 2 页以外，还要加一个第 3 页 专门用一个 crousel 之类的可以滑动的栏目展示结果。可以参考 https://robosnap.github.io/ 里面的展示栏目。里面的内容就是 /scenes/里面的图片，分为 blender nyc berlin playroom，并且，每一个scene里面的三张图片是同一个视角的三种渲染方式，因此你应该把它们叠起来、写一个交互装置，支持用户用鼠标引导两条分割线， 分割线分隔开 grid color 和 texture 三种渲染图片。


Decompositional scene reconstruction aims to reconstruct high-quality ob-jects and background, yet existing methods still struggle with the levelof quality under heavy occlusions. While generative priors offer a poten-tial solution, 2D image-based priors often suffer from multi-view inconsis-tency due to a lack of 3D awareness. Conversely, 3D-native priors providestronger structural inductive biases but frequently lead to spatial drift andmisalignment within complex scenes. To address these issues, we proposeDEcoMVoxEL, formulating object completion as a guided in-situ denoisingoptimization that bridges 3D-native priors with neural scene reconstructionOur framework introduces a reformulated epsilon-based distillation loss toensure stable latent refinement, alongside adaptive spatial guidance thatutilizes occupied and vacant anchors with temporal annealing to suppress
generative hallucinations and eliminate spatial drift. Experiments on Replicaand ScanNet++ show that DEcomVoxEL significantly outperforms state-of-the-art methods by strictly preserving the original spatial layout, structuralfidelity, and style-consistent texture. Our method pushes the boundary ofdecompositional reconstruction by delivering high-quality textured mesheswith clean topology, geometry, and appearance, providing a robust solutionfor the holistic reconstruction of complex real-world scenes.

9. 标题可以使用peach色。




1. 第一页的作者 和 副标题 “Harnessing 3D-Native Priors with Guided In-situ Denoising Optimization for Decompositional Scene Reconstruction” 字号都要大一点
2. 第一页 “Decom”的字体宽度稍微减少一点；“Voxel”字体不用改动。
3. 第一页 data、code、paper 这三个的边框用peach色，不要用白色；鼠标悬浮的时候保持原来的green色的效果。
4. 第二页“Complete the unseen. Preserve the scene.”这个section，改成双栏的，视频缩小一点放在右侧，左侧是文字描述。
5. 第二页的文字描述里面 DecomVoxel， topology, geometry, appearance 和 individual objects 和 backgrounds 使用加粗的peach色。 
6. 第三页的 divider 里面的那个带左右箭头的渐变框，改成纯green色的。
7. 尽量在后面的细节、文字、边框等里面多用 peach色系、green色、和少量的purple色系。背景用paperwarm、dark、dark-2交替，不要使用paper色（太白了）。
8. 偶尔可以模仿 https://vision-language-kinematics.github.io/ 用一些类似 tag 的像文本框一样的设计。
8. Intro后面的环节依次是 "Method", "Results", "Analysis", “Citation”。
    - 其中 "Method" 里面根据 main.tex 的内容分为 In-situ Denoising Optimization 和 Adaptive Spatial Guidance 和 Optimization 三个部分，每个部分写一段话或者分条列举，并引用相关的图片，method 主图是 figures/method.png。
    - "Results" 部分也可以做一个滑动栏目，图片在 results，也是分场景拼图。
    - "Analysis" 部分可以，把文章主结果化成一个柱状图，主结果就是 main.tex 里面的评估表格Quantitative comparison 加上result.txt 合成的大表格，只需要cd psnr 两个图就行，参考 plot_quantitative_results.py。不要直接引用图片（不好看），你需要用html重新绘制一下。然后可以 引用 figures/5-varification.png 简单介绍一点消融实验，



1. 顶部栏目“Intro Method Results Analysis Citation” 字号稍微大一点，而且要跟着浏览进度展示出“激活”或者“未激活”两种状态
2. method overview 下面的副标题改成 Our framework bridges 3D generative priors with neural reconstruction through a guided in-situ denoising optimization.
We segment objects from the initial scene and then sequentially optimize their geometry and appearance under adaptive spatial guidance. This process
recovers missing structures and consistent textures while preserving the original scene layout, producing high-fidelity topology, geometry, and appearance.
3. 而且 method overview 的标题和副标题宽度要占整页宽度，而不要现在的偏左半页宽度。（因为下面的图是整页的宽度）
4. result 部分，“Complete scenes, one object at a time.” 改成 Qualitative Comparison.
5. result 的这个滑动窗口，现在的格式、颜色都保持，但是“ours”的两张图片要缩小一点，并且下面放上五张一排的比较小的比较图，依次是 GT、SAM3D、MVSAM3D、ShapeR、SimRecon，需要用tag标明哪张图是哪个。图片都在 /results/ 里面。
6. Analysis / Quantitative comparison 这里的柱状图配色用：peach,peach-dark,green,yellow,purple,dark_purple.


1. 正标题 DecomVoxel 这个栏目宽一点，把DECOMVOXEL放到一行；或者让“decom”字变窄一点，你之前的改动根本没有改这个地方。但是第一页其它的副标题、作者信息等不需要动。
2. Qualitative Comparison 也像 method overview 栏目一样变成整页的宽度
3. Qualitative Comparison 的滑动窗口整体缩小一点；然后下面的 “GT、SAM3D、MVSAM3D、ShapeR、SimRecon” 整体也缩小很多，而且要确保它们五个的整体宽度=上面两个ours的整体宽度，也就是两排图片的宽度对齐。
4. analysis 柱状图里面的yellow改成acid颜色。


1. 现在 decom 的宽度合适了，但是voxel和decom变成一排了。voxel还是放在下一排比较好。
2. Analysis / Quantitative comparison 里面的颜色改成依次用：peach,purple,acid,dark_purple,peach-dark,green

1. 写一个acknowledgement，致谢 Trellis GeoSVR 还有我们参考的网页模板 https://vision-language-kinematics.github.io/ 和 https://robosnap.github.io/，写在最下面，字体小一些


1. https://fictionarry.github.io/GeoSVR-project/ 给geosvr也加引用。
2. Method Overview 里面的3个部分稍微详细一些，可以每个部分内部分分条列举、分析一下，甚至可以引用重点公式。
3. “Each constraint earns its place.” 改成 “Comparison of different optimization strategies. ”，然后后面那段描述文字也改成  Our proposed epsilon-based denoising loss (a), linear noise schedule (b), re-distributed pruning strategy (c), and cosine-power preservation loss weight schedule (d) consistently achieve the most stable convergence.
4. Ablation / Design choices 这里的图片改成用 figures/var-1.png figures/var-2.png figures/var-3.png figures/var-4.png，它们分别对应的小标题是 (a) Denoising Loss Term (b) Noise Sampling 𝑡 Schedule (c) Prune Strategy (d) Preservation Loss Weight 𝑤𝑂 schedule



In-situ Denoising Optimization 里面，左侧第一个栏目可以改成 Preliminaries，2、3栏目不变。

In-situ Denoising Optimization 最下面方框里面的公式渲染有问题 间距过大，而且也不是公式的形态；∇x′Lε = (1 − t)∇x′Lv 稍微好一些。

Adaptive Spatial Guidance 里面的公式的那个小方框可以直接去掉。Optimization 里的公式也可以直接去掉。


Comparison of different optimization strategies 里面的 (c) 变成 copyright 符号了，要改一下；并且这四张 var 图片，宽度分别是 1:2:1:2，现在的四宫格的宽度是 1:1:1:1，所以不协调，把四宫格宽度调整一下。


1. 文字修正+tag修正
2. video？