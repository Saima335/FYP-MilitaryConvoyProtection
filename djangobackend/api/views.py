from django.shortcuts import render, HttpResponse
from .models import Detection
from .serializers import DetectionSerializer
from .models import Frame
from .serializers import FrameSerializer
from rest_framework.generics import ListAPIView
import cv2
from django.core.files import File

import time
import cv2
import numpy as np
import tensorflow as tf
import keras
from PIL import Image
from keras_retinanet import models
from keras_retinanet.utils.image import read_image_bgr, preprocess_image, resize_image
from keras_retinanet.utils.visualization import draw_box
from keras_retinanet.utils.colors import label_color
import random
import math

#import numpy as np
import argparse
import imutils
import time
#import cv2
import os

import pandas as pd
import statsmodels.api as sm
import matplotlib.pyplot as plt # for data visualization
import seaborn as sns
import csv
sns.set()
from sklearn.cluster import KMeans
import plotly.express as px
from geopy.geocoders import Nominatim
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler

import json

# Create your views here.
class DetectionList(ListAPIView):
    def output():
        found=False
        # Detection.objects.create(detected="found at 3,4")
    output()
    queryset = Detection.objects.all()
    serializer_class = DetectionSerializer

class FrameList(ListAPIView):
    def output():
        in_cap = cv2.VideoCapture("D:\FYP\Implementation\Videos_drone\persondrone.mp4")
        ret, image = in_cap.read()
        count=0
        while ret:
            img_url="D:\FYP\Implementation\connectReactnativeDjango\djangobackend\Frames\\frame%d.jpg" % count
            cv2.imwrite(img_url, image)
            frame=Frame()
            frame.img=img_url
            #frame.img=File(open(img_url,'rb'))
            frame.save()
            ret, image = in_cap.read()
            count+=1
    output()
    queryset = Frame.objects.all()
    serializer_class = FrameSerializer

def Detection(request):

    in_cap = cv2.VideoCapture("video3.mp4")
    out_cap = None

    MODEL_PATH = 'resnet50_csv_60-converted.h5'

    model = models.load_model(MODEL_PATH, backbone_name='resnet50')
    DETECTION_TRESHOLD = 0.5
    labels_to_names = {
    0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane', 5: 'bus',
    6: 'train', 7: 'truck', 8: 'boat', 9: 'traffic light', 10: 'fire hydrant', 11: 'stop sign',
    12: 'parking meter', 13: 'bench', 14: 'bird', 15: 'cat', 16: 'dog', 17: 'horse', 18: 'sheep',
    19: 'cow', 20: 'elephant', 21: 'bear', 22: 'zebra', 23: 'giraffe', 24: 'backpack',
    25: 'umbrella', 26: 'handbag', 27: 'tie', 28: 'suitcase', 29: 'frisbee', 30: 'skis',
    31: 'snowboard', 32: 'sports ball', 33: 'kite', 34: 'baseball bat', 35: 'baseball glove',
    36: 'skateboard', 37: 'surfboard', 38: 'tennis racket', 39: 'bottle', 40: 'wine glass',
    41: 'cup', 42: 'fork', 43: 'knife', 44: 'spoon', 45: 'bowl', 46: 'banana', 47: 'apple',
    48: 'sandwich', 49: 'orange', 50: 'broccoli', 51: 'carrot', 52: 'hot dog', 53: 'pizza',
    54: 'donut', 55: 'cake', 56: 'chair', 57: 'couch', 58: 'potted plant', 59: 'bed',
    60: 'dining table', 61: 'toilet', 62: 'tv', 63: 'laptop', 64: 'mouse', 65: 'remote',
    66: 'keyboard', 67: 'cell phone', 68: 'microwave', 69: 'oven', 70: 'toaster', 71: 'sink',
    72: 'refrigerator', 73: 'book', 74: 'clock', 75: 'vase', 76: 'scissors', 77: 'teddy bear',
    78: 'hair drier', 79: 'toothbrush'
    }

    # Extract video info (fps, number of frames, resolution)
    fps = int(in_cap.get(cv2.CAP_PROP_FPS))
    frame_count = int(in_cap.get(cv2.CAP_PROP_FRAME_COUNT))
    resolution = (int(in_cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(in_cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))

    # Calculate number of steps for progress bar
    # step = 100 / frame_count
    # frame_cnt = 0
    # completed = 0

    # Loop for reading whole video frame by frame
    count = 0
    ret, image = in_cap.read()
    while True:
        
        in_cap.set(cv2.CAP_PROP_POS_MSEC,(count*1000))
        
        # Read single frame
        ret, image = in_cap.read()
        if not ret:
            break
        cv2.imwrite( "D:\FYP\Implementation\connectReactnativeDjango\djangobackend\FramesInput\\frame%d.jpg" % count, image)
        # Visualize input frame which is gonna be processed
        # window.actualize_input_label(npimg_to_pixmap(cv2.cvtColor(image, cv2.COLOR_BGR2RGB)))

        # Detect objects in input frame
        # objects_detected = self.detect_objects(image)
        '''
        Detect the objects in the image.
        :param image: the input image
        :return: the list of detected objects
        '''
        # List of the detected objects
        objects_detected = []

        # Preprocess image for network
        # image = preprocess_image(image)
        # image, scale = resize_image(image)

        # Process image
        start = time.time()
        boxes, scores, labels = model.predict_on_batch(np.expand_dims(image, axis=0))
        print("Processing time: ", time.time() - start)

        # Correct for image scale
        # boxes /= scale

        # Add detected objects to the list
        for box, score, label in zip(boxes[0], scores[0], labels[0]):
            if score < DETECTION_TRESHOLD:
                continue
            box = box.astype(int)
            newbox={
                "box":box,
                "score":score,
                "label":label,
                "points":[(int((box[2] + box[0]) / 2), int((box[3] + box[1]) / 2))],
                "color":label_color(random.randint(1, 79)),
                "cutout" : None,
                "hist" : None,
                "detected_in_first_frame" : False
            }
            objects_detected.append(newbox)

        # Draw objects boundaries to the actual frame
        # image_with_borders = self.draw_bounding_boxes(image, objects_detected)

        '''
        Draw the bounding boxes around the objects in the image.
        :param image: the input image (BGR)
        :param objects: the list of the objects
        :return: the image with the bounding boxes around the objects
        '''
        # Get thickness of border lines, font and font size
        x, y = image.shape[0], image.shape[1]
        z = (x * y + 100000) // 100000
        P = 0.5
        thickness = int(math.sqrt(z / (4 * P) + 1))

        # # Copy to draw on
        # image_with_borders= image.copy()
        # image_with_borders = cv2.cvtColor(image_with_borders, cv2.COLOR_BGR2RGB)

        # # For every object draw the bounding box and the caption
        # for obj in objects_detected:
        #   box = obj["box"]
        #   score = obj["score"]
        #   label = obj["label"]
        #   color = label_color(label)
        #   draw_box(image_with_borders, box, color=color, thickness=thickness)
        #   # caption = "%.1f%%" % (score * 100)
        #   # For detection various types of objects can be use following caption
        #   caption = "%s: %.1f%%" % (labels_to_names[label], score * 100)
        #   # draw_caption(image_with_borders, box, caption, int(thickness*0.75), int(thickness*0.75))
        #   cv2.putText(image_with_borders, caption, (box[0], box[1] - 10), cv2.FONT_HERSHEY_PLAIN, int(thickness*0.75), (0, 0, 0), int((int(thickness*0.75)) * 2.5))
        #   cv2.putText(image_with_borders, caption, (box[0], box[1] - 10), cv2.FONT_HERSHEY_PLAIN, int(thickness*0.75), (255, 255, 255), int(thickness*0.75))
        # # If output is video capture of frames with object boundaries
        # if out_cap is None:
        #   # Create output video capture for writing frames
        #   out_cap = cv2.VideoWriter("/content/drive/My Drive/Person-Detection-Using-Drone-Footage/people_detected.avi", cv2.VideoWriter_fourcc(*'MJPG'), fps, resolution)
        # out_cap.write(cv2.cvtColor(image_with_borders, cv2.COLOR_BGR2RGB))

        # For every object draw the bounding box and the caption
        for obj in objects_detected:
            box = obj["box"]
            score = obj["score"]
            label = obj["label"]
            color = label_color(label)
            draw_box(image, box, color=color, thickness=thickness)
            # caption = "%.1f%%" % (score * 100)
            # For detection various types of objects can be use following caption
            caption = "%s: %.1f%%" % (labels_to_names[label], score * 100)
            # draw_caption(image_with_borders, box, caption, int(thickness*0.75), int(thickness*0.75))
            cv2.putText(image, caption, (box[0], box[1] - 10), cv2.FONT_HERSHEY_PLAIN, int(thickness*0.75), (0, 0, 0), int((int(thickness*0.75)) * 2.5))
            cv2.putText(image, caption, (box[0], box[1] - 10), cv2.FONT_HERSHEY_PLAIN, int(thickness*0.75), (255, 255, 255), int(thickness*0.75))
        cv2.imwrite( "D:\FYP\Implementation\connectReactnativeDjango\djangobackend\FramesOutput\\frame%d.jpg" % count, image)
        # if out_cap is None:
        #     # Create output video capture for writing frames
        #     out_cap = cv2.VideoWriter("people_detected.avi", cv2.VideoWriter_fourcc(*'MJPG'), fps, resolution)
        # out_cap.write(image)
        count=count+1

        # Save visualized frame to tmp/image-dir/
        # image = Image.fromarray(image_with_borders)
        # image.save(tmp_frame_dir + file.get_frame_name(output_type) + '-frame' + str(frame_cnt) + '.jpg')

        # Visualize processed frame with detected objects to output label
        # window.actualize_output_label(npimg_to_pixmap(image_with_borders))

        # Update progress bar
        # completed += step
        # window.progress_bar.setValue(completed)

        # frame_cnt += 1

    # out_cap.release()
    in_cap.release()
    return HttpResponse("Done")
    # cv2.destroyAllWindows()

def valueReturn(request):
    data={"active":True}
    return HttpResponse(data)

def Detection2(request):
    video = request.GET.get('video')
    print(video)
    # video="video0.mp4"
    data={"person":False}
    # load the COCO class labels our YOLO model was trained on
    labelsPath = "coco.names"
    LABELS = open(labelsPath).read().strip().split("\n")
    # initialize a list of colors to represent each possible class label
    np.random.seed(42)
    COLORS = np.random.randint(0, 255, size=(len(LABELS), 3),dtype="uint8")
    # derive the paths to the YOLO weights and model configuration
    weightsPath = "yolov3.weights"
    configPath =  "yolov3.cfg"
    # load our YOLO object detector trained on COCO dataset (80 classes)
    # and determine only the *output* layer names that we need from YOLO
    print("[INFO] loading YOLO from disk...")
    net = cv2.dnn.readNetFromDarknet(configPath, weightsPath)
    ln = net.getLayerNames()
    ln = [ln[i - 1] for i in net.getUnconnectedOutLayers()]

    # initialize the video stream, pointer to output video file, and
    # frame dimensions
    vs = cv2.VideoCapture(video)
    writer = None
    (W, H) = (None, None)
    # try to determine the total number of frames in the video file
    try:
        prop = cv2.cv.CV_CAP_PROP_FRAME_COUNT if imutils.is_cv2() \
            else cv2.CAP_PROP_FRAME_COUNT
        total = int(vs.get(prop))
        print("[INFO] {} total frames in video".format(total))
    # an error occurred while trying to determine the total
    # number of frames in the video file
    except:
        print("[INFO] could not determine # of frames in video")
        print("[INFO] no approx. completion time can be provided")
        total = -1

    count = 0
    (grabbed, frame) = vs.read()
    # loop over frames from the video file stream
    while True:
        vs.set(cv2.CAP_PROP_POS_MSEC,(count*1000))
        # read the next frame from the file
        (grabbed, frame) = vs.read()
        # if the frame was not grabbed, then we have reached the end
        # of the stream
        if not grabbed:
            break
        cv2.imwrite( "D:\FYP\Implementation\connectReactnativeDjango\djangobackend\FramesInput2\\frame%d.jpg" % count, frame)
        # if the frame dimensions are empty, grab them
        if W is None or H is None:
            (H, W) = frame.shape[:2]
            
        # construct a blob from the input frame and then perform a forward
        # pass of the YOLO object detector, giving us our bounding boxes
        # and associated probabilities
        blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (416, 416),
            swapRB=True, crop=False)
        net.setInput(blob)
        start = time.time()
        layerOutputs = net.forward(ln)
        end = time.time()
        # initialize our lists of detected bounding boxes, confidences,
        # and class IDs, respectively
        boxes = []
        confidences = []
        classIDs = []
        
        # loop over each of the layer outputs
        for output in layerOutputs:
            # loop over each of the detections
            for detection in output:
                # extract the class ID and confidence (i.e., probability)
                # of the current object detection
                scores = detection[5:]
                classID = np.argmax(scores)
                confidence = scores[classID]
                # filter out weak predictions by ensuring the detected
                # probability is greater than the minimum probability
                if confidence > 0.5:
                    # scale the bounding box coordinates back relative to
                    # the size of the image, keeping in mind that YOLO
                    # actually returns the center (x, y)-coordinates of
                    # the bounding box followed by the boxes' width and
                    # height
                    box = detection[0:4] * np.array([W, H, W, H])
                    (centerX, centerY, width, height) = box.astype("int")
                    # use the center (x, y)-coordinates to derive the top
                    # and and left corner of the bounding box
                    x = int(centerX - (width / 2))
                    y = int(centerY - (height / 2))
                    # update our list of bounding box coordinates,
                    # confidences, and class IDs
                    boxes.append([x, y, int(width), int(height)])
                    confidences.append(float(confidence))
                    classIDs.append(classID)
                    
        # apply non-maxima suppression to suppress weak, overlapping bounding boxes
        idxs = cv2.dnn.NMSBoxes(boxes, confidences, 0.5,0.3)
        # ensure at least one detection exists
        if len(idxs) > 0:
            # loop over the indexes we are keeping
            for i in idxs.flatten():
                # extract the bounding box coordinates
                (x, y) = (boxes[i][0], boxes[i][1])
                (w, h) = (boxes[i][2], boxes[i][3])
                # draw a bounding box rectangle and label on the frame
                color = [int(c) for c in COLORS[classIDs[i]]]
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                text = "{}: {:.4f}".format(LABELS[classIDs[i]],confidences[i])
                cv2.putText(frame, text, (x, y - 5),cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                print("Before Break")
                if "person" in text:
                    data={"person":True}
                    print("After Break")
                    return HttpResponse(headers={'Person':True})

        # # check if the video writer is None
        # if writer is None:
        #     # initialize our video writer
        #     fourcc = cv2.VideoWriter_fourcc(*"MJPG")
        #     writer = cv2.VideoWriter("car_chase_01.avi", fourcc, 30,(frame.shape[1], frame.shape[0]), True)
        #     # some information on processing single frame
        #     if total > 0:
        #         elap = (end - start)
        #         print("[INFO] single frame took {:.4f} seconds".format(elap))
        #         print("[INFO] estimated total time to finish: {:.4f}".format(elap * total))
        # # write the output frame to disk
        # writer.write(frame)

        cv2.imwrite( "D:\FYP\Implementation\connectReactnativeDjango\djangobackend\FramesOutput3\\frame%d.jpg" % count, frame)
        count=count+1
    # release the file pointers
    print("[INFO] cleaning up...")
    #writer.release()
    vs.release()
    return HttpResponse("Done Processing")

def Hotspot(request):
    geolocator=Nominatim(user_agent="geoapiExercises")
    data = pd.read_csv('D:\FYP\Implementation\connectReactnativeDjango\djangobackend\FinalattackData.csv')
    #print(data)
    #print(data)
    #below commands are used to display the coordinates in graph
    #plt.scatter(x, y)
    #plt.show()
    #print(data)
    #Using pandas way, Series.value_counts()
    df1 = data['areaaName'].value_counts()
    #print(df1.index)
    places=df1.index
    array=[]
    filename = 'D:\FYP\Implementation\connectReactnativeDjango\djangobackend\FinalattackData.csv'

    with open(filename, 'r') as csvfile:
        datareader = csv.reader(csvfile)
        for x in places:
            sum=0
            for row in datareader:
                #print(row[1])
                #print(x==row[1])
                if x == row[1]:
                    sum=sum+int(row[3])
                else:
                    continue
            array.append(sum)
            continue
    print(places)
    fig = px.bar(df1)
    fig.show()

    #fig.write_html('first_figure.html', auto_open=True)
    #df2 = data.areaaName.value_counts

    #print(df1)
    return HttpResponse(headers={'Places':places})

def Risk(request):
    name = request.GET.get('name')
    print(name)
    # filtering the rows where Credit-Rating is Fair
    df = pd.read_csv("D:\FYP\Implementation\connectReactnativeDjango\djangobackend\FinalattackData.csv")
    totalMartyrNumber=df[df.columns[3]].sum()
    result=[]
    ProbablityOfLoss=0
    RiskOccurenceChances=len(df)
    #print(RiskOccurenceChances)
    df = df[df['areaaName'].str.contains(name)]
    #print((df))
    ProbablityOfLoss=df[df.columns[3]].sum()
    #ProbablityOfLoss=(ProbablityOfLoss/totalMartyrNumber)*1000
    #print(totalMartyrNumber)
    count=len(df)
    #print(ProbablityOfLoss)
    FutureOccurence=(count/RiskOccurenceChances)*count*100
    #print(count)
    result.append(name)
    result.append(count)
    result.append(ProbablityOfLoss)
    df=df["attaackNature"]
    for x in df:
        attack=x
        break
    result.append(attack)
    result.append(FutureOccurence)
    print(result)
    return HttpResponse(headers={'Result':result})

def HotspotKMean(request):
    # filtering the rows where Credit-Rating is Fair
    data = pd.read_csv("D:\FYP\Implementation\connectReactnativeDjango\djangobackend\globalterrorismdb_0718dist.csv",encoding='latin-1')
    data.drop(['iyear','imonth','iday','suicide'], axis=1, inplace=True)
    #print(data.isnull().sum()
    data=data[data['country_txt'].str.contains('Pakistan')]

    #print(data)
    data['latitude'].fillna(data['latitude'].mean(), inplace=True)
    data['longitude'].fillna(data['longitude'].mean(), inplace=True)
    X = data.iloc[:,[2,3]].values
    wcss=[]
    for i in range (1,11):
        kmeans = KMeans(n_clusters = i, init = 'k-means++', max_iter =300, n_init = 10, random_state = 0)
        kmeans.fit(X)
        wcss.append(kmeans.inertia_)

    # Plot the graph to visualize the Elbow Method to find the optimal number of cluster  
    # plt.plot(range(1,11),wcss)
    # plt.title('The Elbow Method')
    # plt.xlabel('Number of clusters')
    # plt.ylabel('WCSS')
    # plt.show()

    # Applying KMeans to the dataset with the optimal number of cluster

    kmeans=KMeans(n_clusters= 3, init = 'k-means++', max_iter = 300, n_init = 10, random_state = 0)
    y_kmeans = kmeans.fit_predict(X)

    # Visualising the clusters

    # plt.scatter(X[y_kmeans == 0, 0], X[y_kmeans == 0,1],s = 100, c='yellow', label ='Attacked Areas 1')

    # plt.scatter(X[y_kmeans == 1, 0], X[y_kmeans == 1,1],s = 100, c='blue', label = 'Attacked Areas 2')

    # plt.scatter(X[y_kmeans == 2, 0], X[y_kmeans == 2,1],s = 100, c='green', label = 'Attacked Areas 3')

    # plt.scatter(X[y_kmeans == 3, 0], X[y_kmeans == 3,1],s = 100, c='cyan', label = 'Attacked Areas 4')

    # plt.scatter(X[y_kmeans == 4, 0], X[y_kmeans == 4,1],s = 100, c='magenta', label = 'Attacked Areas 5')


    # plt.scatter(kmeans.cluster_centers_[:,0], kmeans.cluster_centers_[:,1], s = 300, c = 'red', label = 'Hotspot Areas')
    centers = kmeans.cluster_centers_
    centers=centers.tolist()
    print("Result: ",centers)
    
    # for x in centers:
    #     x[1]=round(x[1],6)
    #     lat=str(x[1])
    #     print("latitude is   ",lat)
    #     #print(data["latitude"])
    #     data=data[data["longitude"].str.contains(lat)]
    #     print(data)
        #a=data[data['latitude'].str.contains(lat)]

    # geolocator = Nominatim(user_agent="geoapiExercises")
    # for x in centers:
    #     print(x[0])
    #     print(x[1])
    #     latitude=str(x[0])
    #     longitude=str(x[1])
        
    #     location=geolocator.reverse(latitude+","+longitude)
    #     address = location.raw['address']
    #     city = address.get('city', '')
    #     print(location)
    # plt.title('HotSpot Areas')
    # plt.xlabel('Area X')
    # plt.ylabel('Area Y')
    # plt.legend()
    # plt.show()
    return HttpResponse(headers={'Result':centers})

def LandmineKMean(request):
    # filtering the rows where Credit-Rating is Fair
    data = pd.read_csv("D:\FYP\Implementation\connectReactnativeDjango\djangobackend\globalterrorismdb_0718dist.csv",encoding='latin-1')
    data.drop(['iyear','imonth','iday','suicide'], axis=1, inplace=True)
    #print(data.isnull().sum()
    data=data[data['country_txt'].str.contains('Pakistan')]

    #print(data)
    data['latitude'].fillna(data['latitude'].mean(), inplace=True)
    data['longitude'].fillna(data['longitude'].mean(), inplace=True)
    X = data.iloc[:,[2,3]].values
    wcss=[]
    for i in range (1,11):
        kmeans = KMeans(n_clusters = i, init = 'k-means++', max_iter =300, n_init = 10, random_state = 0)
        kmeans.fit(X)
        wcss.append(kmeans.inertia_)

    # Plot the graph to visualize the Elbow Method to find the optimal number of cluster  
    # plt.plot(range(1,11),wcss)
    # plt.title('The Elbow Method')
    # plt.xlabel('Number of clusters')
    # plt.ylabel('WCSS')
    # plt.show()

    # Applying KMeans to the dataset with the optimal number of cluster

    kmeans=KMeans(n_clusters= 5, init = 'k-means++', max_iter = 300, n_init = 10, random_state = 0)
    y_kmeans = kmeans.fit_predict(X)

    # Visualising the clusters

    # plt.scatter(X[y_kmeans == 0, 0], X[y_kmeans == 0,1],s = 100, c='yellow', label ='Attacked Areas 1')

    # plt.scatter(X[y_kmeans == 1, 0], X[y_kmeans == 1,1],s = 100, c='blue', label = 'Attacked Areas 2')

    # plt.scatter(X[y_kmeans == 2, 0], X[y_kmeans == 2,1],s = 100, c='green', label = 'Attacked Areas 3')

    # plt.scatter(X[y_kmeans == 3, 0], X[y_kmeans == 3,1],s = 100, c='cyan', label = 'Attacked Areas 4')

    # plt.scatter(X[y_kmeans == 4, 0], X[y_kmeans == 4,1],s = 100, c='magenta', label = 'Attacked Areas 5')


    # plt.scatter(kmeans.cluster_centers_[:,0], kmeans.cluster_centers_[:,1], s = 300, c = 'red', label = 'Hotspot Areas')
    centers = kmeans.cluster_centers_
    centers=centers.tolist()
    print("Result: ",centers)
    
    # for x in centers:
    #     x[1]=round(x[1],6)
    #     lat=str(x[1])
    #     print("latitude is   ",lat)
    #     #print(data["latitude"])
    #     data=data[data["longitude"].str.contains(lat)]
    #     print(data)
        #a=data[data['latitude'].str.contains(lat)]

    # geolocator = Nominatim(user_agent="geoapiExercises")
    # for x in centers:
    #     print(x[0])
    #     print(x[1])
    #     latitude=str(x[0])
    #     longitude=str(x[1])
        
    #     location=geolocator.reverse(latitude+","+longitude)
    #     address = location.raw['address']
    #     city = address.get('city', '')
    #     print(location)
    # plt.title('HotSpot Areas')
    # plt.xlabel('Area X')
    # plt.ylabel('Area Y')
    # plt.legend()
    # plt.show()
    return HttpResponse(headers={'Result':centers})

def RiskArea(request):
    name = request.GET.get('name')
    print(name)
    result=[]
    result.append(name)
    # filtering the rows where Credit-Rating is Fair
    data = pd.read_csv('D:\FYP\Implementation\connectReactnativeDjango\djangobackend\globalterrorismdb_0718dist.csv', encoding='latin-1')
    data=data[data['country_txt'].str.contains('Pakistan')]
    success1=data['success'].sum()
    print("total success",success1)
    result.append(success1)
    data["city"].fillna("Jalal", inplace = True)
    exist = data[data['city'].str.contains(name)]
    for CHECK in exist:
        if not CHECK:
            print("not found")
        else:
            #data=data[data['city'].str.contains("Quetta")]
            check_nan = data['city'].isnull().sum()
            #print("city nan values",check_nan)
            #data['city'].fillna('Jalal')
            data["city"].fillna("Jalal", inplace = True)
            data=data[data['city'].str.contains(name)]
            targeted=data['targtype1_txt'].unique()
            gangname=data['gname'].unique()
            weaponUsed=data['weaptype1_txt'].unique()
            attackNature=data['attacktype1_txt'].unique()
            successRate=(data['success'].sum()/success1)*1000
            targeted = [x.replace('\n', '') for x in targeted]
            print("Targets   ",targeted)
            result.append(targeted)
            gangname = [x.replace('\n', '') for x in gangname]
            print("gang involved ",gangname)
            result.append(gangname)
            weaponUsed = [x.replace('\n', '') for x in weaponUsed]
            print("weapon used ",weaponUsed)
            result.append(weaponUsed)
            attackNature = [x.replace('\n', '') for x in attackNature]
            print("attack Nature ",attackNature)
            result.append(attackNature)
            print("success Rate ",successRate)
            result.append(successRate)
            break
    print(result)
    return HttpResponse(headers={'Result':result})

def RiskPath(request):
    areas = request.GET.get('areas')
    areas = json.loads(areas)
    print(areas)
    
    data = pd.read_csv('D:\FYP\Implementation\connectReactnativeDjango\djangobackend\globalterrorismdb_0718dist.csv', encoding='latin-1')
    data=data[data['country_txt'].str.contains('Pakistan')]
    success=data['success'].sum()
    totalAttacks=len(data)
    # data['latitude'].fillna(data['latitude'].mean(), inplace=True)
    # data['longitude'].fillna(data['longitude'].mean(), inplace=True)
    # area=[]
    # for x in areas:
    #     data = pd.read_csv('D:\FYP\Implementation\connectReactnativeDjango\djangobackend\globalterrorismdb_0718dist.csv', encoding='latin-1')
    #     data=data[data['country_txt'].str.contains('Pakistan')]
    #     lat=str(x[0])
    #     lon=str(x[1])
    #     data['latitude']=data['latitude'].astype(str)
    #     data['longitude']=data['longitude'].astype(str)
    #     data=data[data['latitude'].str.contains(lat)]
    #     data=data[data['longitude'].str.contains(lon)]
    #     area1=data['city'].to_list()
    #     if(len(area1)>0):
    #         area.append(area1[0])
    totalPathRisk=0
    for x in areas:
        data = pd.read_csv('D:\FYP\Implementation\connectReactnativeDjango\djangobackend\globalterrorismdb_0718dist.csv', encoding='latin-1')
        data=data[data['country_txt'].str.contains('Pakistan')]
        success=data['success'].sum() 
        totalAttacks=len(data)
        data["city"].fillna("Jalal", inplace = True)
        exist = data[data['city'].str.contains(x)]
        #print(exist)
        for CHECK in exist:
            if not CHECK:
                print("not found")
            else:
                #print(x)
                a=data[data['city'].str.contains(x)]
                attackOccured=len(a)
                totalPathRisk=totalPathRisk+((attackOccured*totalAttacks)/((attackOccured*success)+(success*totalAttacks)))*10
    print("total path risk is",totalPathRisk)
    return HttpResponse(headers={'Result':totalPathRisk})
    
