#Alexander S Leonard
#2017/06/22
#V 0.1

#Imports
import openpyxl as xl

from Dive import *

import matplotlib.pyplot as plt

import datetime




#Load methods
def LOAD_DIVES():
    wb = xl.load_workbook(filename='Dives.xlsx', read_only=True,data_only=True)
    print wb.get_sheet_names()
    Raw_Data = wb['Ocean']
    #Meaningful_Columns=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P']
    Meaningful_Columns=['A','B','C','D','E','F','G','H','I','J','K']
    Columns={'Dive Number':'A','Date':'B','Country':'C','Site':'D','Max Depth':'E','Average Depth':'F','Duration':'G','Mix':'H','Temperature':'I','Exposure Suit':'J','Weight':'K','Cylinder':'L','Buddy':'M','Stops':'O'}
    row=2
    Dives=[]
    while Raw_Data['A{}'.format(row)].value:
        #print Raw_Data['A{}'.format(row)].value
        Dives.append(Dive(*[Raw_Data['{}{}'.format(C,row)].value for C in sorted(Columns.values())]))
        row+=1
    Standardize_Dates(Dives)
    return Dives
    

def Standardize_Dates(dives):
    """ Change YYYY/MM/DD spreadsheet format to python datetime """
    EPOCH_OFFSET=25567
    for dive in dives:
        if dive.date:
            new_date=datetime.datetime.fromtimestamp((dive.date-EPOCH_OFFSET)*24*3600)
            dive.date=new_date
        else:
            print 'dive number {} date missing'.format(dive.dive_number)
        
def Plot_Test(dives):
    #dives=LOAD_DIVES()
    plt.figure()
    plt.plot([dive.dive_number for dive in dives],[dive.max_depth for dive in dives])
    plt.show(block=False)

def Plot_Dives_By_Date(dives):

    
    plt.figure()
    plt.plot_date([dive.date for dive in dives if dive.date], [dive.dive_number for dive in dives if dive.date])
    plt.gcf().autofmt_xdate()
    plt.show(block=False)
def Plot_SAC_By_Date(dives):
    plt.figure()
    plt.plot_date([dive.date for dive in dives if dive.date], [dive.Get_SAC() for dive in dives if dive.date])
    plt.gcf().autofmt_xdate()
    plt.show(block=False)
    
dives='empty'
def main():
    global dives
    dives=LOAD_DIVES()
    print min([dive.Get_SAC() for dive in dives if dive.Get_SAC()>0])
