class Dive(object):
    """A dive :

    Attributes:
        name: A string representing the customer's name.
        balance: A float tracking the current balance of the customer's account.
    """

    def __init__(self, dive_number, date, country, site, max_depth, avg_depth, duration, mix,temp, exposure_suit,weight,cylinder, buddy, stops):
        self.dive_number=dive_number
        self.date=date
        self.country=country
        self.site=site
        self.max_depth=max_depth
        self.avg_depth=avg_depth
        self.duration=duration
        self.weight=weight
        self.exposure_suit=exposure_suit
        self.buddy=buddy
        self.stops=stops
        self.mix=mix
        self.temp=temp
        self.cylinder=cylinder
        self.pressure_in=200
        self.pressure_out=50
        
        

    def __repr__(self):
        return 'Dive number {}'.format(self.dive_number)

    def Get_SAC(self):
        #if '+' in self.cylinder:
        if self.cylinder:
            if 'L' in self.cylinder:
                cylinder_volume=sum([int(vol[:-1]) for vol in self.cylinder.split('+')])
            else:
                cylinder_volume=sum([int(vol[:-4]) for vol in self.cylinder.split('+')])
                cylinder_volume=20
            return (self.pressure_in-self.pressure_out)*cylinder_volume /((self.avg_depth/10.+1) * self.duration)
        else:
            return -1

    
    

        
